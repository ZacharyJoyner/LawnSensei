using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Lawnsensei.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LawnController : ControllerBase
    {
        [HttpGet("protected-endpoint")]
        [Authorize]
        public IActionResult GetProtectedData()
        {
            return Ok(new { message = "This is protected lawn data." });
        }
    }
}
