import { useRouter } from 'next/router'
import Script from 'next/script';
import ComfyJS from 'comfy.js'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'

export default function BrowserSourceForUser() {
  const router = useRouter()
  const session = useSession()
  let provider_token;
  let nickname;
  if(session) {
    provider_token = session?.provider_token;
    nickname = session?.user.user_metadata.nickname;
  }
  const { userId } = router.query
  return (
    <>
      <div
        style={{ display: "none" }}
        id="data-holder"
        data-user-id={userId}
        data-auth-token={process.env.NEXT_PUBLIC_TWITCH_AUTH_TOKEN}
        // data-auth-token={provider_token}
        data-user-name={nickname}
      ></div>
      <Script
        id="ComfyJS"
        src="https://cdn.jsdelivr.net/npm/comfy.js@latest/dist/comfy.min.js"
        onReady={() => {
          const dataHolder = document.getElementById('data-holder');
          const userId = String(dataHolder?.dataset?.userId);
          const userName = String(dataHolder?.dataset?.userName);
          const authToken = String(dataHolder?.dataset?.authToken);
          const ALLOWED_COMMANDS: any = {
            'beer': `/api/beer/${userId}/current`,
            'beercurrent': `/api/beer/${userId}/current`,
            'beerlast': `/api/beer/${userId}/last`
          }
          ComfyJS.onCommand = ( user, command, message, flags, extra ) => {
              if(ALLOWED_COMMANDS[command]) {
                console.log(ALLOWED_COMMANDS[command])
                  fetch(ALLOWED_COMMANDS[command])
                  .then((response) => response.json())
                  .then((data) => {
                      ComfyJS.Say(`${userName}'s beer was a ${data.beer.beer_name} it's a ${data.beer.beer_style} from ${data.brewery.brewery_name} in ${data.brewery.country_name}`, userName);
                  });
              }
          }
          ComfyJS.Init( userName, authToken );
        }}
      >
      </Script>
    </>
  )
}