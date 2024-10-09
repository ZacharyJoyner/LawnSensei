// OnboardingData.cs
using System;
using System.ComponentModel.DataAnnotations;

namespace LawnSensei.Server.Models
{
    public class OnboardingData
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public string UserId { get; set; }  // Assuming this is linked to a user system

        [Required]
        public string Address { get; set; }

        [Required]
        public string ClimateZone { get; set; }

        [Required]
        public string LawnSize { get; set; }

        [Required]
        public string GrassType { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}