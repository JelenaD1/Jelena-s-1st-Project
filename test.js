document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector("button")
  const post = document.querySelector(".post")
  const widget = document.querySelector(".star-widget")
  const editBtn = document.querySelector(".edit")
  const textarea = document.querySelector(".textdelete")
  const ul = document.querySelector(".review-form")
  const form = document.querySelector(".form-review")

  btn.onclick = () => {
    widget.style.display = "none"
    post.style.display = "block"
    editBtn.onclick = () => {
      widget.style.display = "block"
      post.style.display = "none"
      textarea.innerHTML = ""
    }
    return false
  }
  //Get the review from db.json and displayed them on page
  const urlFetch = "http://localhost:3000/reviews"
  fetch(urlFetch)
    .then(resp => resp.json())
    .then(data => {
      data.forEach(review => {
        const li = document.createElement("li")
        li.innerHTML = review.element
        ul.append(li)
      })
    })
//Allow user to leave a comment and allow comments to be displayed on the page(persistance needed)
  form.addEventListener("submit", (event) => {
    event.preventDefault()
    const newReview = form.querySelector("#comment")
    const confObject = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        element: newReview.value
      })
    }

    fetch(urlFetch, confObject)
      .then(resp => resp.json())
      .then(data => {
        const li = document.createElement("li")
        li.innerHTML = data.element
        ul.append(li)
        newReview.value = ""
      })
  })

  const div = document.querySelector("div#makeup-collection")
  const url = "http://makeup-api.herokuapp.com/api/v1/products.json?brand=l%27oreal&tags_list=glutenfree"
  const addCardCollection = (collection) => {
    const collectionCard = document.createElement("div")
    collectionCard.classList.add("star-six")
    const collectionProduct = document.createElement("h3")
    collectionProduct.innerHTML = collection.product_type
    const collectionImage = document.createElement("img")
    collectionImage.classList.add("pic-style")
    collectionImage.src = collection.image_link
    const collectionPrice = document.createElement("p")
    collectionPrice.innerHTML = `$${collection.price}`
    collectionPrice.classList.add("p")
    const collectionName = document.createElement("h4")
    collectionName.innerHTML = collection.name
    collectionCard.append(collectionProduct, collectionImage, collectionPrice, collectionName)
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
