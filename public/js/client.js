document.addEventListener('DOMContentLoaded', async () => {
  const response = await fetch('/auth/supportuser');
  const authdata = await response.json();

  let jwt = authdata.credentials;
  let supportNumber = authdata.number;

  let client = new NexmoClient();
  application = await client.login(jwt);
  console.log(`You've logged in with the user ${application.me.name}`);

  // Whenever a call is received, bind an event that ends the call to
  // the hangup button
  application.on("member:call", (member, call) => {
    let terminateCall = () => {
      call.hangUp();
      toggleCallStatusButton('idle');
      btnHangup.removeEventListener('click', terminateCall)
    };
    btnHangup.addEventListener('click', terminateCall);
  });

  // Whenever we click the call button, trigger a call to the support number
  // and hide the Call Now button
  btnCall.addEventListener('click', () => {
    application.callServer(supportNumber);
    toggleCallStatusButton('in_progress');
  });
});

function toggleCallStatusButton(state) {
  if (state === 'in_progress') {
    btnCall.style.display = "none";
    btnHangup.style.display = "inline-block";
  } else {
    btnCall.style.display = "inline-block";
    btnHangup.style.display = "none";
  }
}

