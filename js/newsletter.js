document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('form#email-form');
  if (!form) return;

  const successMsg = document.querySelector('.success-message');
  const errorMsg = document.querySelector('.error-message');

  let mailerToken = '';

  // 读取 config.json 获取 token
  fetch('js/config.json')
    .then(res => res.json())
    .then(cfg => {
      mailerToken = cfg.token;
    });

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (successMsg) successMsg.style.display = 'none';
    if (errorMsg) errorMsg.style.display = 'none';

    const name = form.querySelector('input[name="name"]').value.trim();
    const email = form.querySelector('input[name="email"]').value.trim();

    try {
      // 若 token 未加载，阻止提交
      if (!mailerToken) {
        if (errorMsg) errorMsg.style.display = '';
        if (successMsg) successMsg.style.display = 'none';
        return;
      }

      const res = await fetch('https://connect.mailerlite.com/api/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + mailerToken
        },
        body: JSON.stringify({
          email: email,
          fields: {
            name: name
          }
        })
      });

      if (res.status === 200 || res.status === 201) {
        if (form) {
          form.reset();
          setTimeout(() => {
            form.style.display = 'none';
            if (successMsg) {
              successMsg.style.display = 'block';
            }
            if (errorMsg) errorMsg.style.display = 'none';
          }, 100);
        }
      } else {
        if (errorMsg) errorMsg.style.display = 'block';
        if (successMsg) successMsg.style.display = 'none';
      }
    } catch (err) {
      if (errorMsg) errorMsg.style.display = 'block';
      if (successMsg) successMsg.style.display = 'none';
    }
  });
});
