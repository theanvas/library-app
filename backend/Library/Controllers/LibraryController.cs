using EmployeeAdminPortal.Data;
using Library.Models;
using Library.Models.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Library.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LibraryController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;
        public LibraryController(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        //prikazuje sve
        [HttpGet]
        public IActionResult GetAllBooks()
        {
            var allBooks = dbContext.Books.ToList();

            return Ok(allBooks);
        }

        //prikazuje po id-ju 
        [HttpGet]
        [Route("{id:guid}")]
        public IActionResult GetBookById(Guid id)
        {
            var book = dbContext.Books.Find(id);

            if (book is null)
            {
                return NotFound();
            }

            return Ok(book);
        }

        //dodaje create
        [HttpPost]
        public IActionResult AddBook(AddBook book)
        {
            var newbook = new Book()
            {
                Title = book.Title,
                Author = book.Author,
                Year = book.Year,
                Rating = book.Rating
            };

            dbContext.Books.Add(newbook);
            dbContext.SaveChanges();

            return Ok(newbook);
        }


        [HttpPut]
        [Route("{id:guid}")]
        public IActionResult UpdateBook(Guid id, UpdateBook updateBook)
        {
            var book = dbContext.Books.Find(id);

            if (book is null)
            {
                return NotFound();
            }
            book.Title = updateBook.Title;
            book.Author = updateBook.Author;
            book.Year = updateBook.Year;
            book.Rating = updateBook.Rating;

            dbContext.SaveChanges();

            return Ok(book);
        }

        [HttpDelete]
        [Route("{id:guid}")]
        public IActionResult DeleteBook(Guid id)
        {
            var book = dbContext.Books.Find(id);

            if (book is null)
            {
                return NotFound();
            }

            dbContext.Books.Remove(book);
            dbContext.SaveChanges();

            return Ok();
        }












    }
}
