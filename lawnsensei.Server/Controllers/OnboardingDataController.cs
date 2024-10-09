// OnboardingDataController.cs
using LawnSensei.Server.Data;
using LawnSensei.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace LawnSensei.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OnboardingDataController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OnboardingDataController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/OnboardingData
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAll()
        {
            var onboardingData = await _context.OnboardingData.ToListAsync();
            return Ok(onboardingData);
        }

        // GET: api/OnboardingData/{id}
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetById(Guid id)
        {
            var onboardingData = await _context.OnboardingData.FindAsync(id);
            if (onboardingData == null)
            {
                return NotFound();
            }
            return Ok(onboardingData);
        }

        // POST: api/OnboardingData
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create(OnboardingData onboardingData)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.OnboardingData.Add(onboardingData);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = onboardingData.Id }, onboardingData);
        }

        // PUT: api/OnboardingData/{id}
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(Guid id, OnboardingData updatedData)
        {
            if (id != updatedData.Id)
            {
                return BadRequest();
            }

            _context.Entry(updatedData).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.OnboardingData.Any(e => e.Id == id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        // DELETE: api/OnboardingData/{id}
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(Guid id)
        {
            var onboardingData = await _context.OnboardingData.FindAsync(id);
            if (onboardingData == null)
            {
                return NotFound();
            }

            _context.OnboardingData.Remove(onboardingData);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}