using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder.Extensions;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Firebase Initialization
FirebaseApp.Create(new AppOptions
{
    Credential = GoogleCredential.FromFile("\"C:\\Users\\Zacha\\source\\repos\\lawnsensei\\lawnsensei.Server\\firebase\\lawn-sensei-firebase-adminsdk-e7ody-eaf9c6181f.json\"") // Update the path to your Firebase JSON file
});

// Add services to the container
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// JWT Authentication Setup
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = "https://securetoken.google.com/your-firebase-project-id"; // Replace with your Firebase project ID
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = "https://securetoken.google.com/your-firebase-project-id", // Replace with your Firebase project ID
            ValidateAudience = true,
            ValidAudience = "your-firebase-project-id", // Replace with your Firebase project ID
            ValidateLifetime = true
        };
    });

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication(); // Add this line to enable authentication
app.UseAuthorization();

app.MapControllers();
app.MapFallbackToFile("/index.html");

app.Run();
