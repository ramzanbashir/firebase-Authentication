
import { auth, db, ref, push, set, onValue } from './firebase-config.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// === Handle Login/Signup ===
window.handleLogin = function () {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!name || !email || !password) {
    alert("Please fill all fields.");
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert("Signup successful!");
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      if (error.code === "auth/email-already-in-use") {
        // Try to login
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            alert("Login successful!");
            window.location.href = "dashboard.html";
          })
          .catch((err) => {
            alert("Login failed: " + err.message);
          });
      } else {
        alert("Signup failed: " + error.message);
      }
    });
};

// === Handle Logout ===
window.logout = function () {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
};

// === Auth Check for Dashboard ===
if (window.location.pathname.includes("dashboard.html")) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      fetchProductsFromFirebase(user.uid);
    } else {
      window.location.href = "index.html";
    }
  });
}

// === Add Product ===
window.addProduct = function () {
  const name = document.getElementById("productName").value;
  const desc = document.getElementById("productDesc").value;
  const price = document.getElementById("productPrice").value;
  const imageInput = document.getElementById("productImage");

  if (!name || !desc || !price) {
    alert("Please fill all product fields");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const imageURL = e.target.result;
    const user = auth.currentUser;
    if (user) {
      renderCard(name, desc, price, imageURL);
      saveProductToFirebase(user.uid, name, desc, price, imageURL);
    }
  };

  if (imageInput.files.length > 0) {
    reader.readAsDataURL(imageInput.files[0]);
  } else {
    const imageURL = "https://via.placeholder.com/100";
    const user = auth.currentUser;
    if (user) {
      renderCard(name, desc, price, imageURL);
      saveProductToFirebase(user.uid, name, desc, price, imageURL);
    }
  }

  bootstrap.Modal.getInstance(document.getElementById('addProductModal')).hide();
  document.getElementById("productName").value = "";
  document.getElementById("productDesc").value = "";
  document.getElementById("productPrice").value = "";
  document.getElementById("productImage").value = "";
};

// === Render Card ===
function renderCard(name, desc, price, imageURL) {
  const list = document.getElementById("productList");
  const col = document.createElement("div");
  col.className = "col-md-6";
  col.innerHTML = `
    <div class="card text-center">
      <div class="card-body">
        <img src="${imageURL}" class="img-fluid mb-2" style="max-height:100px;">
        <p><strong>${name}</strong></p>
        <p>${desc}</p>
        <p><strong>$${price}</strong></p>
        <div class="d-flex justify-content-center gap-2">
          <button class="btn btn-warning btn-sm">Edit</button>
          <button class="btn btn-danger btn-sm">Delete</button>
        </div>
      </div>
    </div>
  `;
  list.appendChild(col);
}

// === Save to Firebase under UID ===
function saveProductToFirebase(uid, name, desc, price, imageURL) {
  const userProductsRef = ref(db, `users/${uid}/products`);
  const newProductRef = push(userProductsRef);
  set(newProductRef, {
    name,
    description: desc,
    price,
    image: imageURL,
    timestamp: Date.now()
  });
}

// === Fetch Products from Firebase ===
function fetchProductsFromFirebase(uid) {
  const userProductsRef = ref(db, `users/${uid}/products`);
  onValue(userProductsRef, (snapshot) => {
    const list = document.getElementById("productList");
    list.innerHTML = ""; // Clear previous
    const data = snapshot.val();
    for (let key in data) {
      const item = data[key];
      renderCard(item.name, item.description, item.price, item.image || "https://via.placeholder.com/100");
    }
  });
}
