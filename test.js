document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector("button")
  const post = document.querySelector(".post")
  const widget = document.querySelector(".star-widget")
  const editBtn = document.querySelector(".edit")
  // const textarea = document.querySelector(".textdelete")
  const ul = document.querySelector(".review-form")
  const form = document.querySelector(".form-review")
  const div = document.querySelector("div#makeup-collection")
  const options = []
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

  // Display makeup collection when the page loads(including name, image, price and description)
  fetch(url)
    .then(resp => resp.json())
    .then(data => {
      data.forEach(collection => {
        addCardCollection(collection)
      })
    })

  const ratingButton = document.querySelector(".btnRating")

  // When post is clicked display the rating descripton on the page
  ratingButton.addEventListener("click", (event) => {
    const textarea = document.querySelector(".textdelete")
    const userRating = textarea.value
    console.log(userRating)
    const confObject = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        comments: userRating
      })
    }
    fetch("http://localhost:3000/ratings", confObject)
      .then(resp => resp.json())
      .then(data => {
        const liItem = document.createElement("li")
        liItem.innerHTML = data.comments
        ul.append(liItem)
      })
  })


  ////Post the rating comments when the page loads
  fetch("http://localhost:3000/ratings")
    .then(resp => resp.json())
    .then(data => {
      data.forEach(object => {
        const liItems = document.createElement("li")
        liItems.innerHTML = object.comments
        ul.append(liItems)
      })
    })
  // Widget ratings
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

  //add Event Listener on the form(comments) and allow user to post a comment
  //Send a post request to the server 
  form.addEventListener("submit", (event) => {
    event.preventDefault()
    const newReview = form.querySelector("#comment")
    const optionId = document.querySelector("#optionId")
    const confObject = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        content: newReview.value,
        optionId: parseInt(optionId.value)
      })
    }

    fetch("http://localhost:3000/comments", confObject)
      .then(resp => resp.json())
      .then(data => {
        console.log(data)
        const li = document.createElement("li")
        li.innerHTML = data.content
        ul.append(li)
        newReview.value = ""
      })
  })
//get a options(products) from a database and have them displayed in the menu 
  fetch("http://localhost:3000/options")
    .then(resp => resp.json())
    .then(data => {
      data.forEach(object => {
        const option = document.createElement("option")
        option.value = object.id
        option.innerHTML = object.name
        option.name = object.name
        menu.append(option)
        options.push(object.name)
      })
    })
//add Event Listener on the menu and allow user to select each option and read the comments specific to that option
  const menu = document.querySelector("#menu")
  menu.addEventListener("change", (event) => {
    div.innerHTML = ""
    event.preventDefault()
    console.log(event.target.value)
    fetch("http://localhost:3000/comments")
      .then(resp => resp.json())
      .then(data => {
        console.log(data)
        const filterData = data.filter(comment =>
          comment.optionId === parseInt(event.target.value)
        )
        const optionId = document.querySelector("#optionId")
        optionId.value = event.target.value
        const ul = document.querySelector("ul")
        ul.innerHTML = ""
        filterData.forEach(object => {
          const li = document.createElement("li")
          li.innerHTML = object.content
          ul.append(li)
        })
      })

    fetch(url)
      .then(resp => resp.json())
      .then(data => {
        data.filter((productType) => {
          if (productType.product_type === options[event.target.value - 1]) {
            addCardCollection(productType)
          }
        })
      })
  })
})
