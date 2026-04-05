# Budget Feature (Flutter)
Clean Architecture yapısında bu özellik 3'e ayrılır:
- **data**: Model, Repository implementasyonu ve Data Source'lar (API istekleri).
- **domain**: Entity'ler, Repository arayüzleri ve Usecase'ler (Business Logic).
- **presentation**: Bloc/Cubit veya Riverpod state management, widget'lar ve sayfalar.
