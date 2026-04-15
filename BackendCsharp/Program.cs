using BudgetApi;
using BudgetApi.Data;
using BudgetApi.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// Bütün kaynaklardan gelen isteklere izin ver (Geliştirme için)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// PostgreSQL (EF Core) Bağlantısı
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Servislerin Dependency Injection Containera Eklenmesi
builder.Services.AddScoped<IAuthService, AuthService>();

// JWT Bağlantı / Ayarlama Konfigürasyonu
var tokenKey = builder.Configuration.GetSection("AppSettings:Token").Value;
if(string.IsNullOrEmpty(tokenKey)) {
    throw new Exception("JWT Token sırrı ayarlanamadı! appsettings.json dosyasını kontrol edin.");
}

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey)),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });

// Swagger Altyapısı (Test aracı ve JWT uyumlu dokümantasyon)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Lütfen JWT Tokeninizi 'Bearer Token_Gelecek' formatında (veya Swagger üzerinden sadece Token'ı yazarak) girin.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement{
        {
            new OpenApiSecurityScheme {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            new string[] {}
        }
    });
});

var app = builder.Build();

var defaultConnection = builder.Configuration.GetConnectionString("DefaultConnection");
if (app.Environment.IsDevelopment())
{
    PostgresDatabaseBootstrap.EnsureDatabaseExists(defaultConnection);
    using (var scope = app.Services.CreateScope())
    {
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        db.Database.Migrate();
    }

    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection(); // SSL Sertifika uyarısı vermemesi ve Mobil cihazlardan teste kolaylık sağlaması için iptal edildi.

// Middlewares (Sırlama Önemli: CORS -> Authentication -> Authorization)
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapGet("/", context => {
    context.Response.Redirect("/swagger");
    return Task.CompletedTask;
});

app.Run();
