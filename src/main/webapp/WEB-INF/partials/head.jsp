<title>${param.title}</title>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
<style>
    form {
        margin: 0;
    }
    .table td {
        vertical-align: middle;
    }
</style>
<script type="text/javascript">
    // set the active navbar link
  window.onload = () => {
    Array.from(document.querySelectorAll(".nav-link")).forEach(link => {
      if (link.href === window.location.href) {
        link.classList.add("active")
      }
    })
  }
</script>
