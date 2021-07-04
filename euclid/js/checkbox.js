function check(event) {
  
    if(event.code === 'Enter' || event.code === 'Space')
    {
      const checkbox = document.querySelector('#check')
      checkbox.checked = !checkbox.checked
    }
  }      
 