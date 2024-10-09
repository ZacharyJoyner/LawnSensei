// OnboardingController.cs
using LawnSensei.Server.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace LawnSensei.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OnboardingController : ControllerBase
    {
        private static List<OnboardingData> onboardingDataList = new List<OnboardingData>();

        // Create Onboarding Data
        [HttpPost]
        public IActionResult CreateOnboardingData([FromBody] OnboardingData onboardingData)
        {
            if (ModelState.IsValid)
            {
                onboardingDataList.Add(onboardingData);
                return Ok(onboardingData);
            }

            return BadRequest(ModelState);
        }

        // Get All Onboarding Data
        [HttpGet]
        public IActionResult GetAllOnboardingData()
        {
            return Ok(onboardingDataList);
        }

        // Get Onboarding Data by Id
        [HttpGet("{id}")]
        public IActionResult GetOnboardingDataById(Guid id)
        {
            var onboardingData = onboardingDataList.FirstOrDefault(data => data.Id == id);
            if (onboardingData == null)
            {
                return NotFound();
            }

            return Ok(onboardingData);
        }

        // Update Onboarding Data
        [HttpPut("{id}")]
        public IActionResult UpdateOnboardingData(Guid id, [FromBody] OnboardingData updatedData)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var onboardingData = onboardingDataList.FirstOrDefault(data => data.Id == id);
            if (onboardingData == null)
            {
                return NotFound();
            }

            onboardingData.Address = updatedData.Address;
            onboardingData.ClimateZone = updatedData.ClimateZone;
            onboardingData.LawnSize = updatedData.LawnSize;
            onboardingData.GrassType = updatedData.GrassType;
            onboardingData.UserId = updatedData.UserId;

            return Ok(onboardingData);
        }

        // Delete Onboarding Data
        [HttpDelete("{id}")]
        public IActionResult DeleteOnboardingData(Guid id)
        {
            var onboardingData = onboardingDataList.FirstOrDefault(data => data.Id == id);
            if (onboardingData == null)
            {
                return NotFound();
            }

            onboardingDataList.Remove(onboardingData);
            return NoContent();
        }
    }
}
