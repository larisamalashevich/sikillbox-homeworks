document.addEventListener('DOMContentLoaded',function() {
  document.querySelector('#burger').addEventListener('click',function() {
    const menutag = document.querySelector('#menu')
    menutag.classList.toggle('menu_is-active')  
  })

  
  document.querySelector('.close-menu-btn').addEventListener('click',function() {
    document.querySelector('#menu').classList.remove('menu_is-active')  
  })

})