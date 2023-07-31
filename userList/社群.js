let baseUrl = "https://user-list.alphacamp.io";
const indexUrl = baseUrl + "/api/v1/users/";
const dataPanel = document.querySelector("#data-panel");
const userList = [];
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const USER_PER_PAGE = 30;
const paginator = document.querySelector("#paginator");

let userFindList = [];

// 顯示用戶圖示
function showUsers(data) {
  let rawHTML = "";
  data.forEach((item) => {
    rawHTML += `<div class="card m-3" style="width: 12rem;" >
      <img class="card-img-top" src="${item.avatar}" alt="Photo">
        <div class="card-body d-flex flex-column justify-content-center align-items-center">
          <h5 class="card-title  text-center">${
            item.surname + " " + item.name
          }</h5>
          <div class="d-grid gap-2 d-md-flex justify-content-center">
            <button class="btn btn-secondary btn-show-info" data-bs-toggle="modal" data-bs-target="#user-modal"  data-id="${
              item.id
            }"" >About me</button>
      
          </div>
          
          <div class="d-grid gap-2 d-md-flex justify-content-center">
          <button class="btn btn-add-favorite custom-button" style="width: 50px; max-width: 100%;" ><i class="fa-regular fa-star fa-lg" style="color: #1f3e51;" data-id="${
    item.id
  }"></i></button>
</div>
</div>
       
    </div>`;
  });
  dataPanel.innerHTML = rawHTML;
}

// 顯示用戶詳細資料
function showUserModal(id) {
  const modalTitle = document.querySelector("#user-modal-title");
  const modalEmail = document.querySelector("#user-modal-email");
  const modalGender = document.querySelector("#user-modal-gender");
  const modalAge = document.querySelector("#user-modal-age");
  const modalRegion = document.querySelector("#user-modal-region");
  const modalBirthday = document.querySelector("#user-modal-birthday");
  const modalAvatar = document.querySelector("#user-modal-image");

  axios
    .get(indexUrl + id)
    .then((response) => {
      const data = response.data;
      modalTitle.innerText = data.surname + " " + data.name;
      modalEmail.innerText = "Email: " + data.email;
      modalGender.innerText = "Gender: " + data.gender;
      modalAge.innerText = "Age: " + data.age;
      modalRegion.innerText = "Region: " + data.region;
      modalBirthday.innerText = "Birthday: " + data.birthday;
      modalAvatar.innerHTML = `<img src="${data.avatar}" alt="avatar" class="img-fluid" />`;
    })
    .catch((err) => {
      console.log(err);
    });
}

dataPanel.addEventListener("click", function onClicked(event) {
  if (event.target.matches(".btn-show-info")) {
    showUserModal(Number(event.target.dataset.id));
  } else if (event.target.matches(".fa-star")) {
    addToFavorite(Number(event.target.dataset.id));
  }
});

// dataPanel.addEventListener("click", function onClicked(event) {
//   if (event.target.matches(".btn-show-info")) {
//     showUserModal(Number(event.target.dataset.id));
//   } else if (event.target.matches(".fa-star")) {
//     addToFavorite(Number(event.target.dataset.id));
//     event.target.classList.toggle("fas");
//   }
// });



searchForm.addEventListener("submit", function formSubmit(event) {
  event.preventDefault();

  const keyword = searchInput.value.trim().toLowerCase();

  userFindList = userList.filter(
    (user) =>
      user.name.toLowerCase().includes(keyword) ||
      user.surname.toLowerCase().includes(keyword)
  );

  if (userFindList.length === 0) {
    return alert(`你輸入的關鍵字：${keyword} 沒有符合條件的使用者`);
  }
  // 重製分頁器
  renderPageinator(userFindList.length);
  // 預設顯示第 1 頁的搜尋結果
  showUsers(getUserPage(1));
});

// 加入收藏功能
function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem("favoriteUser")) || [];
  const user = userList.find((user) => user.id === id);
  if (list.some((user) => user.id === id)) {
    return alert("此人已被加入");
  }
  list.push(user);
  localStorage.setItem("favoriteUser", JSON.stringify(list));
}

function getUserPage(page) {
  // 如果條件成立(userFindList有東西)，會等於 userFindList 反之 則是userList
  const data = userFindList.length ? userFindList : userList;
  // 計算起始 index
  const starIndex = (page - 1) * USER_PER_PAGE;
  // 回傳切割後的新陣列
  return data.slice(starIndex, starIndex + USER_PER_PAGE);
}

function renderPageinator(amount) {
  // 計算總頁數
  const numberOfPages = Math.ceil(amount / USER_PER_PAGE);
  // 製作 template
  let rawHTML = "";

  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`;
  }
  // 放回 HTML
  paginator.innerHTML = rawHTML;
}

paginator.addEventListener("click", function onPaginatorClicked(event) {
  // 不是點到a標籤，直接結束
  if (event.target.tagName !== "A") return;

  // 透過 dataset 取得被點擊的頁數
  const page = Number(event.target.dataset.page);
  // 更新畫面
  showUsers(getUserPage(page));
});

axios
  .get(indexUrl)
  .then((response) => {
    userList.push(...response.data.results);
    renderPageinator(userList.length);
    showUsers(getUserPage(1));
  })
  .catch((err) => {
    console.log(err);
  });

showUsers(getUserPage(1));
