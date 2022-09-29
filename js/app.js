const inputName = document.querySelector(".catalog-control input");
const catalog = document.querySelector(".catalog");
const selectBrand = document.getElementById("filter-brand");
const selectType = document.getElementById("filter-type");
const sortType = document.getElementById("sort-type");

let products = []

async function init(){
  try {
    products = listAll();
    renderData();
    renderBrand();
    renderType();

  } catch (error) {
  showError("Error loading data", error);
  } 
}
init();

async function listAll(){
  const response = await fetch("./data/products.json");
  return await response.json();
}

//filtros
//nome
const hideProducts = (products, inputValue) => {
  products
  .filter(product => !product.textContent.toLowerCase().includes(inputValue))
  .forEach(product => {
    product.classList.add('hidden')
  });
}

const showProducts = (products, inputValue) => {
  products
    .filter(product => product.textContent.toLowerCase().includes(inputValue))
    .forEach(product => {
      product.classList.remove('hidden')
  });
}

inputName.addEventListener("input", evt => {
  const inputValue = evt.target.value.trim().toLowerCase();
  const products = Array.from(catalog.children);
  hideProducts(products, inputValue);
  showProducts(products, inputValue)
});

//marca (carregar e filtrar)
async function renderBrand() {
  const products = await listAll();

  const brands = new Set();

  for(const product of products){
    brands.add(product.brand);
  }

  for(const brand of brands){
      const option = document.createElement("option");
      option.textContent = brand;
      option.value = brand;
      selectBrand.appendChild(option);
  }
};

selectBrand.addEventListener("change", evt => {
  const selectedValue = selectBrand.options[selectBrand.selectedIndex].text;
  if(selectBrand.options[selectBrand.selectedIndex].text == "Todos"){
    renderData();
  } else {
    renderDataByBrand(selectedValue);
  }
});

async function renderDataByBrand(selectedValue){
  const products = await listAll();

  const byBrand = products.filter((item) => item.brand == selectedValue);
  
  let innerHTML = "";
  for(const product of byBrand) {
    const item = productItem(product);
    innerHTML += item;
  }
  catalog.innerHTML = innerHTML;
  document.body.appendChild(catalog); 
}

//tipo (carregar e filtro)
async function renderType() {
  const products = await listAll();

  const types = new Set();

  for(const product of products){
    types.add(product.product_type);
  }

  for(const type of types){
      const option = document.createElement("option");
      option.textContent = type;
      option.value = type;
      selectType.appendChild(option);
  }
};

selectType.addEventListener("change", evt => {
  const selectedValue = selectType.options[selectType.selectedIndex].text;
  if(selectType.options[selectType.selectedIndex].text == "Todos"){
    renderData();
  } else {
    renderDataByType(selectedValue);
  }
});

async function renderDataByType(selectedValue){
  const products = await listAll();

  const byType = products.filter((item) => item.product_type == selectedValue);
  
  let innerHTML = "";
  for(const product of byType) {
    const item = productItem(product);
    innerHTML += item;
  }
  catalog.innerHTML = innerHTML;
  document.body.appendChild(catalog); 
}

//ultimo filtro


//carregar as informações
async function renderData(){
  const products = await listAll();
  products.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
  
  let innerHTML = "";
  for(const product of products) {
    const item = productItem(product);
    innerHTML += item;
  }
  catalog.innerHTML = innerHTML;
  document.body.appendChild(catalog); 
}

//EXEMPLO DO CÓDIGO PARA UM PRODUTO
function productItem(product) {
  const price = (Math.round(product.price * 5.5 * 100) / 100).toFixed(2);
  const details = loadDetails(product);
  const renderItem = 
    `<div class="product" data-name="${product.name || ""}" data-brand="${product.brand}" data-type="${product.product_type}" tabindex="508">
        <section class="product-description">
          <div class="product-brands">
            <span class="product-type background-price">${product.product_type}</span>
          </div>
        </section>
        <figure class="product-figure">
          <img src=${product.image_link} width="215" height="215" alt="${product.name}" onerror="javascript:this.src='img/unavailable.png'">
        </figure>
        <section class="product-description">
          <h1 class="product-name">${product.name}</h1>
          <div class="product-brands">
            <span class="product-brand background-brand">${product.brand}</span>
          </div>
          <div class="product-brands>
            <span class="product-price background-price">R$${price}</span>
          </div>
          ${details} 
        </section>
    </div>`; //cria tudo e dps chama o loadDetails
  return renderItem;
}

//EXEMPLO DO CÓDIGO PARA OS DETALHES DE UM PRODUTO
function loadDetails(product) {
  const price = (Math.round(product.price * 5.5 * 100) / 100).toFixed(2);
  let details = `<section class="product-details"><div class="details-row">
        <div>Brand</div>
        <div class="details-bar">
          <div class="details-bar-bg" style="width= 250">${product.brand}</div>
        </div>
      </div><div class="details-row">
        <div>Price</div>
        <div class="details-bar">
          <div class="details-bar-bg" style="width= 250">R$${price}</div>
        </div>
      </div><div class="details-row">
        <div>Rating</div>
        <div class="details-bar">
          <div class="details-bar-bg" style="width= 250">${product.rating}</div>
        </div>
      </div><div class="details-row">
        <div>Category</div>
        <div class="details-bar">
          <div class="details-bar-bg" style="width= 250">${product.category}</div>
        </div>
      </div><div class="details-row">
        <div>Product_type</div>
        <div class="details-bar">
          <div class="details-bar-bg" style="width= 250">${product.product_type}</div>
        </div>
      </div></section>`;
    return details;
}
