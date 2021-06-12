document.addEventListener("DOMContentLoaded", () => {
  const div = document.querySelector("div#makeup-collection")
  const url = "http://makeup-api.herokuapp.com/api/v1/products.json?brand=l%27oreal&tags_list=glutenfree"
  const addCardCollection = (collection) => {
    const collectionCard = document.createElement("div")
    collectionCard.classList.add("card")
    const collectionName = document.createElement("h3")
    collectionName.innerHTML = collection.product_type
    const collectionImage = document.createElement("img")
    collectionImage.classList.add("toy-avatar")
    collectionImage.src = collection.image_link
    const collectionPrice = document.createElement("p")
    collectionPrice.innerHTML = `$${collection.price}`
    collectionPrice.classList.add("p")
    collectionCard.append(collectionName, collectionImage, collectionPrice)
    div.append(collectionCard)
  }
  const menu = document.querySelector("#menu")
  menu.addEventListener("change", (event) => {
    div.innerHTML = ""
    event.preventDefault()
    fetch(url)
      .then(resp => resp.json())
      .then(data => {
        console.log(data)
        const newArray = []
        data.filter((productType) => {
          if (productType.product_type === menu.value) {
            addCardCollection(productType)
          }
        })
      })
  })

  fetch(url)
    .then(resp => resp.json())
    .then(data => {
      data.forEach(collection => {
        addCardCollection(collection)
      })
    })
})
