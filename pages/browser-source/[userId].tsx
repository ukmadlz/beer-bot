import { useRouter } from 'next/router'
import Script from 'next/script';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';

export default function BrowserSourceForUser() {
  const router = useRouter()
  const session = useSession()
  console.log(session)
  const { userId } = router.query
  return (
    <>
      <div
        style={{ display: "none" }}
        id="data-holder"
        data-user-id={userId}
        data-auth-token={process.env.NEXT_PUBLIC_TWITCH_AUTH_TOKEN}
      ></div>
      <Script
        id="ComfyJS"
        src="https://cdn.jsdelivr.net/npm/comfy.js@latest/dist/comfy.min.js"
        onReady={() => {
          const dataHolder = document.getElementById('data-holder');
          const { userId, authToken } = dataHolder?.dataset;
          console.log(userId)
          const channel = 'ukmadlz';
          const ALLOWED_COMMANDS = {
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
                      ComfyJS.Say(`${channel}'s beer was a ${data.beer.beer_name} it's a ${data.beer.beer_style} from ${data.brewery.brewery_name} in ${data.brewery.country_name}`)
                      console.log(`${channel}'s beer was a ${data.beer.beer_name} it's a ${data.beer.beer_style} from ${data.brewery.brewery_name} in ${data.brewery.country_name}`)
                  });
              }
          }
          ComfyJS.Init( channel, authToken );
        }}
      >
      </Script>
    </>
  )
}