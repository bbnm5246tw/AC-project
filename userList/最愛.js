let baseUrl = "https://user-list.alphacamp.io";
const indexUrl = baseUrl + "/api/v1/users/";

const dataPanel = document.querySelector("#data-panel");
const userList = JSON.parse(localStorage.getItem("favoriteUser"));

// 展示用戶列表
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
  <button class="btn btn-danger btn-remove-favorite custom-btn" style="width: 50px; max-width: 100%;" data-id="${
    item.id
  }">X</button>
</div>
      </div>
    </div>`;
  });
  dataPanel.innerHTML = rawHTML;
}

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
  } else if (event.target.matches(".btn-remove-favorite")) {
    removeFavorite(Number(event.target.dataset.id));
  }
});
showUsers(userList);

// 移除功能
function removeFavorite(id) {
  if (!userList || !userList.length) return;

  // 尋找userList中與點擊id相符的id，findIndex會返回該id的索引位置
  const userIndex = userList.findIndex((user) => user.id === id);
  // 移除該索引位置的元素
  userList.splice(userIndex, 1);
  // 更改後的內容存入本地伺服器
  localStorage.setItem("favoriteUser", JSON.stringify(userList));
  showUsers(userList);
}
