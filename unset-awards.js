import {getCliClient} from 'sanity/cli'
const client = getCliClient({apiVersion: '2024-01-01'})
client.patch('aboutPage-about').unset(['awards']).commit().then(console.log)