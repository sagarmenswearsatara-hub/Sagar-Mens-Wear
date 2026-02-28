// ================= OPEN PRODUCT PAGE =================
function openProduct(name, price, img){

  // Automatically detect current folder
  const basePath = window.location.pathname.substring(
    0,
    window.location.pathname.lastIndexOf("/") + 1
  );

  const baseURL = window.location.origin + basePath;

  const url =
    baseURL +
    "product.html?name=" + encodeURIComponent(name) +
    "&price=" + encodeURIComponent(price) +
    "&img=" + encodeURIComponent(img);

  window.location.href = url;
}


// ================= SHARE PRODUCT =================
function shareProduct(event, name, price, img){

  event.stopPropagation();

  const basePath = window.location.pathname.substring(
    0,
    window.location.pathname.lastIndexOf("/") + 1
  );

  const baseURL = window.location.origin + basePath;

  const shareURL =
    baseURL +
    "product.html?name=" + encodeURIComponent(name) +
    "&price=" + encodeURIComponent(price) +
    "&img=" + encodeURIComponent(img);

  if (navigator.share) {
    navigator.share({
      title: name,
      text: `Check out this product 👕\n${name}\nPrice: ₹${price}`,
      url: shareURL
    });
  } else {
    alert("Sharing not supported on this device.");
  }
}


// ================= LOAD PRODUCTS =================
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

        <button class="share-btn"
          onclick="shareProduct(event,'${safeName}','${price}','${img}')">
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
.catch(err => console.error("Error loading products:", err));
