document.addEventListener('DOMContentLoaded',function() {

 document.querySelectorAll('.work_btn_step').forEach(function(workBtnStep) {
  
  workBtnStep.addEventListener('click',function(event) {
        const path=event.currentTarget.dataset.path

        document.querySelectorAll('.work_content').forEach(function(workContent) {
          workContent.classList.add('work_content_is_invisible')
        })
   
        document.querySelector(`[data-target="${path}"]`).classList.remove('work_content_is_invisible')


      document.querySelectorAll('.work_btn_step__is_active').forEach(function(button){
        button.setAttribute('aria-selected', 'false')
        button.classList.remove('work_btn_step__is_active')
      })

      workBtnStep.classList.add('work_btn_step__is_active')
      workBtnStep.setAttribute('aria-selected', 'true')

    })

})

})
