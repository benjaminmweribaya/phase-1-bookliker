document.addEventListener("DOMContentLoaded", () => {
    const listPanel = document.getElementById("list");
    const showPanel = document.getElementById("show-panel");
    const currentUser = { id: 1, username: "pouros" };

    // Fetch and display all books
    function fetchBooks() {
        fetch("http://localhost:3000/books")
            .then(response => response.json())
            .then(books => renderBookList(books))
            .catch(error => console.error("Error fetching books:", error));
    }

    // Render the list of books
    function renderBookList(books) {
        listPanel.innerHTML = ""; // Clear any existing book list
        books.forEach(book => {
            const li = document.createElement("li");
            li.textContent = book.title;
            li.addEventListener("click", () => showBookDetails(book));
            listPanel.appendChild(li);
        });
    }

    // Display the book details
    function showBookDetails(book) {
        showPanel.innerHTML = `
        <h2>${book.title}</h2>
        <img src="${book.thumbnail}" alt="${book.title}">
        <p>${book.description}</p>
        <h4>Liked by:</h4>
        <ul id="users-list">
          ${book.users.map(user => `<li>${user.username}</li>`).join('')}
        </ul>
        <button id="like-button">${book.users.some(user => user.id === currentUser.id) ? "Unlike" : "Like"}</button>
      `;

        // Add event listener for like/unlike functionality
        const likeButton = document.getElementById("like-button");
        likeButton.addEventListener("click", () => toggleLike(book));
    }

    // Toggle the like/unlike functionality for a book
    function toggleLike(book) {
        const userIndex = book.users.findIndex(user => user.id === currentUser.id);
        if (userIndex === -1) {
            // If user hasn't liked the book, add the user
            book.users.push(currentUser);
        } else {
            // If user has already liked the book, remove the user
            book.users.splice(userIndex, 1);
        }

        // Update the server with the new list of users
        fetch(`http://localhost:3000/books/${book.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ users: book.users }),
        })
            .then(response => response.json())
            .then(updatedBook => showBookDetails(updatedBook))
            .catch(error => console.error("Error updating book likes:", error));
    }

    // Initial fetch of books when page loads
    fetchBooks();
});

