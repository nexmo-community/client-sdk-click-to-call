document.addEventListener('DOMContentLoaded', async () => {
  // Fetch a JWT from the server to authenticate the user
  const response = await fetch('/auth/supportuser');
  const jwt = await response.json();

  // Create a new NexmoClient instance and authenticate with the JWT
  let client = new NexmoClient();
  application = await client.login(jwt);
  notifications.innerHTML = `You are logged in as ${application.me.name}`;

  let conversation = null;

  // Whenever a call is made bind an event that ends the call to
  // the hangup button
  application.on("member:call", (member, call) => {
    let terminateCall = () => {
      call.hangUp();
      toggleCallStatusButton('idle');
      btnHangup.removeEventListener('click', terminateCall)
    };
    btnHangup.addEventListener('click', terminateCall);
  });

  // During a call, retrieve the Conversation so that we can determine 
  // if a Member leaves and change the state of the button
  application.on("call:status:changed", (nxmCall) => {
    console.log(`Call status: ${nxmCall.status}`);
    conversation = nxmCall.conversation;
    conversation.on("member:left", (member, event) => {
      toggleCallStatusButton('idle');
    });
  });

  // Whenever we click the call button, trigger a call to the support number
  // and hide the Call Now button
  btnCall.addEventListener('click', () => {
    application.callServer();
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