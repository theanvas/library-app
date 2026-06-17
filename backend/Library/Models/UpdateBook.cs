namespace Library.Models
{
    public class UpdateBook
    {
        public required string Title { get; set; }
        public required string Author { get; set; }
        public string? Year { get; set; }
        public decimal Rating { get; set; }
    }
}
