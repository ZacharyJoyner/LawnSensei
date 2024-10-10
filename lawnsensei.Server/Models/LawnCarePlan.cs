namespace lawnsensei.Server.Models
{
    public class LawnCarePlan
    {
        public int Id { get; set; }
        public string Task { get; set; }
        public string Description { get; set; }
        public DateTime DueDate { get; set; }
    }
}
