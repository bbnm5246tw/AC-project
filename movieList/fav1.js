const BASE_URL = "https://webdev.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/movies/";
const POSTER_URL = BASE_URL + "/posters/";
const movies = JSON.parse(localStorage.getItem("favoriteMovies1")) || [];
const dataPanel = document.querySelector("#data-panel");
const MOVIE_BY_PAGE = 12;
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const modeButtons = document.querySelector("#buttons-container");
const paginator = document.querySelector("#paginator");
const SHOW_MODE = {
  cardMode: "cardMode",
  listMode: "listMode",
};

const modal = {
  filterMovies: [],
  getMoviesByPage(page) {
    const data = modal.filterMovies.length ? modal.filterMovies : movies;
    const startIndex = (page - 1) * MOVIE_BY_PAGE;
    return data.slice(startIndex, startIndex + MOVIE_BY_PAGE);
  },
};

const view = {
  renderMovieList(data) {
    let rawHTML = "";
    data.forEach((item) => {
      switch (this.currentState) {
        case SHOW_MODE.cardMode:
          rawHTML += `<div class="col-sm-3">
    <div class="mb-2">
      <div class="card">
        <img src="${
          POSTER_URL + item.image
        }" class="card-img-top" alt="Movie Poster">
        <div class="card-body">
          <h5 class="card-title">${item.title}</h5>
        </div>
        <div class="card-footer">
          <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${
            item.id
          }">More</button>
          <button class="btn btn-warning btn-remove-favorite" data-id="${
            item.id
          }">X</button>
        </div>
      </div>
    </div>
  </div>`;
          break;
        case SHOW_MODE.listMode:
          rawHTML += `
                    <ul class="list-group">
                      <li class="list-group-item" data-id="${item.id}">
                        <div class="row align-items-center">
                          <div class="col"><h5>${item.title}</h5></div> <!-- 電影標題 -->
                          <div class="col-auto">
                            <button
                              class="btn btn-primary btn-show-movie"
                              data-bs-toggle="modal"
                              data-bs-target="#movie-modal"
                              data-id="${item.id}"
                            >
                              More
                            </button>
                            <button class="btn btn-info btn-remove-favorite" data-id="${item.id}">X</button>
                          </div>
                        </div>
                      </li>
                    </ul>`;
          break;
        default:
          break;
      }
    });
    dataPanel.innerHTML = rawHTML;
  },
  showMovieModal(id) {
    const modalTitle = document.querySelector("#movie-modal-title");
    const modalImage = document.querySelector("#movie-modal-image");
    const modalDate = document.querySelector("#movie-modal-date");
    const modalDescription = document.querySelector("#movie-modal-description");
    axios.get(INDEX_URL + id).then((response) => {
      const data = response.data.results;
      modalTitle.innerText = data.title;
      modalDate.innerText = "Release date: " + data.release_date;
      modalDescription.innerHTML = data.description;
      modalImage.innerHTML = `<img src="${
        POSTER_URL + data.image
      }" alt="movie-poster" class="img-fluid">`;
    });
  },
  setDefaultMode() {
    this.currentState = SHOW_MODE.cardMode;
    this.renderMovieList(modal.getMoviesByPage(1));
  },
  renderPaginator(amount) {
    const numberOfPages = Math.ceil(amount / MOVIE_BY_PAGE);

    let rawHTML = "";
    for (let page = 1; page <= numberOfPages; page++) {
      rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`;
    }
    paginator.innerHTML = rawHTML;
  },
};

const controller = {
  onPanelClicked(event) {
    if (event.target.matches(".btn-show-movie")) {
      view.showMovieModal(Number(event.target.dataset.id));
    } else if (event.target.matches(".btn-remove-favorite")) {
      controller.removeFromFavorite(Number(event.target.dataset.id));
    }
  },
  onSearchFormSubmitted(event) {
    event.preventDefault();
    const keyword = searchInput.value.trim().toLowerCase();

    modal.filterMovies = movies.filter((movie) =>
      movie.title.toLowerCase().includes(keyword)
    );
    if (modal.filterMovies.length === 0) {
      return alert(`你輸入的關鍵字: ${keyword} 沒有符合條件`);
    }
    view.renderMovieList(modal.filterMovies);
  },
  removeFromFavorite(id) {
    if (!movies || !movies.length) return;

    // 透過 id 找到要刪除的 index

    const movieIndex = movies.findIndex((movie) => movie.id === id);
    if (movieIndex === -1) return;
    // 刪除該筆資料
    movies.splice(movieIndex, 1);
    // 存回 localStorage
    localStorage.setItem("favoriteMovies1", JSON.stringify(movies));

    view.renderMovieList(movies);
    view.renderPaginator(modal.getMoviesByPage(page));
  },
  onPaginatorClicked(event) {
    // 如果不是點擊 a 標籤，結束
    if (event.target.tagName !== "A") return;

    // 透過 dataset 取得被點擊的頁數
    const page = Number(event.target.dataset.page);

    view.renderMovieList(modal.getMoviesByPage(page));
  },
  changeMode(event) {
    if (event.target.id === "card-btn") {
      view.currentState = SHOW_MODE.cardMode;
      view.renderMovieList(movies);
    } else if (event.target.id === "list-btn") {
      view.currentState = SHOW_MODE.listMode;
      view.renderMovieList(movies);
    }
  },
};

// 事件監聽器
dataPanel.addEventListener("click", controller.onPanelClicked);
searchForm.addEventListener("submit", controller.onSearchFormSubmitted);
modeButtons.addEventListener("click", controller.changeMode);
paginator.addEventListener("click", controller.onPaginatorClicked);

view.renderPaginator(movies.length);
view.setDefaultMode();
