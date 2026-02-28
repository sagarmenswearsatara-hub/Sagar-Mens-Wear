let currentProduct = {};

// Open product page
function openProduct(name, price, img){
  const productData = { name, price, img };
  localStorage.setItem("selectedProduct", JSON.stringify(productData));
  window.location.href = "product.html";
}

// Share
function shareProduct(event, name, price){
  event.stopPropagation();

  const shareData = {
    title: name,
    text: `Check out this product 👕\n${name}\nPrice: ₹${price}`,
    url: window.location.origin + "/product.html"
  };

  if (navigator.share) {
    navigator.share(shareData);
  } else {
    alert("Sharing not supported on this device.");
  }
}

// Load Products
const sheetURL =
"https://docs.google.com/spreadsheets/d/1Cx6L_shglPh3mAHyELM6TK3148Jq7vnnsuqRE5OBZQ4/gviz/tq?tqx=out:json";

fetch(sheetURL)
.then(res => res.text())
.then(data => {

  const json = JSON.parse(data.substr(47).slice(0,-2));
  const rows = json.table.rows;

  let html = "";

  rows.forEach(r => {

    const name = r.c[0]?.v || "";
    const oldPrice = r.c[1]?.v || "";
    const price = r.c[2]?.v || "";
    const img = r.c[3]?.v || "";

    if(!name || !price || !img) return;

    const safeName = name.replace(/'/g, "\\'");

    html += `
    <div class="col">
      <div class="card product-card position-relative"
           onclick="openProduct('${safeName}','${price}','${img}')"
           style="cursor:pointer;">

        <img src="${img}" class="card-img-top">

        <!-- SHARE BUTTON -->
        <button class="share-btn"
          onclick="shareProduct(event,'${safeName}','${price}')">
          ↗
        </button>

        <div class="card-body text-center">
          <h6>${name}</h6>
          <p class="price">
            <span class="old-price">₹${oldPrice}</span>
            <span class="new-price">₹${price}</span>
          </p>
        </div>

      </div>
    </div>
    `;
  });

  document.getElementById("products-list").innerHTML = html;

})
.catch(err => console.error(err));