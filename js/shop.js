let allShopProducts=[]
document.addEventListener('DOMContentLoaded',()=>{
  fetch('products.json')
    .then(r=>{
      if(!r.ok)throw new Error(r.status)
      return r.json()
    })
    .then(d=>{
      if(d.products&&Array.isArray(d.products)){
        allShopProducts=d.products
        displayProducts(allShopProducts,'shop-products')
      }
      setupAddToCartHandlers()
      const s=document.getElementById('searchInput')
      const o=document.getElementById('sortSelect')
      if(s){
        s.addEventListener('input',()=>{
          filterAndSortProducts()
        })
      }
      if(o){
        o.addEventListener('change',()=>{
          filterAndSortProducts()
        })
      }
    })
    .catch(e=>{
      console.error('Error fetching products.json for Shop page:',e)
    })
})
function filterAndSortProducts(){
  const s=document.getElementById('searchInput')
  const o=document.getElementById('sortSelect')
  let r=[...allShopProducts]
  if(s&&s.value.trim()!==''){
    r=r.filter(p=>p.name.toLowerCase().includes(s.value.toLowerCase()))
  }
  if(o){
    if(o.value==='nameAsc'){
      r.sort((a,b)=>a.name.localeCompare(b.name))
    }else if(o.value==='nameDesc'){
      r.sort((a,b)=>b.name.localeCompare(a.name))
    }else if(o.value==='priceAsc'){
      r.sort((a,b)=>a.price-b.price)
    }else if(o.value==='priceDesc'){
      r.sort((a,b)=>b.price-a.price)
    }
  }
  displayProducts(r,'shop-products')
  setupAddToCartHandlers()
}
