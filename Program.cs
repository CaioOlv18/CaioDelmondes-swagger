using CaioDelmondes.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Configuração dos controllers e do Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// O Repository fica como Singleton para manter os dados em memória
builder.Services.AddSingleton<IMaterialRepository, MaterialRepository>();

// Configuração do CORS para permitir o uso futuro por um frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirFrontend", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("PermitirFrontend");
app.MapControllers();

app.Run();
