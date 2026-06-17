namespace Library.Models.Entities
{
    public class Book
    {
        public Guid Id { get; set; }

        public required string Title { get; set; }
        public required string Author { get; set; }
        public string? Year { get; set; }
        public decimal Rating { get; set; }
    }
}
