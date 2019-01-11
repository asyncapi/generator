# Slack Real Time Messaging API 1.0.0 documentation




## Table of Contents

* [Connection Details](#servers)
* [Events](#events)
  - [Events a client can receive](#events-receive)
  - [Events a client can send](#events-send)
* [Messages](#messages)
* [Schemas](#schemas)


<a name="servers"></a>
## Connection details

<table>
  <thead>
    <tr>
      <th>URL</th>
      <th>Scheme</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>https://slack.com/api/rtm.connect</td>
      <td>https</td>
      <td></td>
    </tr>


  </tbody>
</table>

<a name="security"></a>
## Security

<table>
  <thead>
    <tr>
      <th>Type</th>
      <th>In</th>
      <th>Name</th>
      <th>Scheme</th>
      <th>Format</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>httpApiKey</td>
      <td>query</td>
      <td>token</td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
  </tbody>
</table>


## <a id="events"/>Events

### <a id="events-receive"/>Events a client can receive:
#### Hello 
First event received upon connection.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>hello</code></td>
      </tr>
  </tbody>
</table>



#### Event #1 
Event received when a connection error happens.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>error</code></td>
      </tr>
      <tr>
        <td>error </td>
        <td>
          object
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>error.code </td>
        <td>
          number
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>error.msg </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>



#### Event #2 
The list of accounts a user is signed into has changed.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>accounts_changed</code></td>
      </tr>
  </tbody>
</table>



#### Event #3 
A bot user was added.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>bot_added</code></td>
      </tr>
      <tr>
        <td>bot </td>
        <td>
          object
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>bot.id </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>bot.app_id </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>bot.name </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>bot.icons </td>
        <td>
          object
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>



#### Event #4 
A bot user was changed.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>bot_added</code></td>
      </tr>
      <tr>
        <td>bot </td>
        <td>
          object
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>bot.id </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>bot.app_id </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>bot.name </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>bot.icons </td>
        <td>
          object
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>



#### Event #5 
A channel was archived.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>channel_archive</code></td>
      </tr>
      <tr>
        <td>channel </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>user </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>



#### Event #6 
A channel was created.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>channel_created</code></td>
      </tr>
      <tr>
        <td>channel </td>
        <td>
          object
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>channel.id </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>channel.name </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>channel.created </td>
        <td>
          number
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>channel.creator </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>



#### Event #7 
A channel was deleted.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>channel_deleted</code></td>
      </tr>
      <tr>
        <td>channel </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>



#### Event #8 
Bulk updates were made to a channel's history.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>channel_history_changed</code></td>
      </tr>
      <tr>
        <td>latest </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>ts </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>event_ts </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>



#### Event #9 
You joined a channel.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>channel_joined</code></td>
      </tr>
      <tr>
        <td>channel </td>
        <td>
          object
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>channel.id </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>channel.name </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>channel.created </td>
        <td>
          number
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>channel.creator </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>



#### Event #10 
You left a channel.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>channel_left</code></td>
      </tr>
      <tr>
        <td>channel </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>



#### Event #11 
Your channel read marker was updated.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>channel_marked</code></td>
      </tr>
      <tr>
        <td>channel </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>ts </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>



#### Event #12 
A channel was renamed.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>channel_rename</code></td>
      </tr>
      <tr>
        <td>channel </td>
        <td>
          object
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>channel.id </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>channel.name </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>channel.created </td>
        <td>
          number
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>



#### Event #13 
A channel was unarchived.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>channel_unarchive</code></td>
      </tr>
      <tr>
        <td>channel </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>user </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>



#### Event #14 
A slash command has been added or changed.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>commands_changed</code></td>
      </tr>
      <tr>
        <td>event_ts </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>



#### Event #15 
Do not Disturb settings changed for the current user.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>dnd_updated</code></td>
      </tr>
      <tr>
        <td>user </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>dnd_status </td>
        <td>
          object
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>dnd_status.dnd_enabled </td>
        <td>
          boolean
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>dnd_status.next_dnd_start_ts </td>
        <td>
          number
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>dnd_status.next_dnd_end_ts </td>
        <td>
          number
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>dnd_status.snooze_enabled </td>
        <td>
          boolean
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>dnd_status.snooze_endtime </td>
        <td>
          number
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>



#### Event #16 
Do not Disturb settings changed for a member.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>dnd_updated_user</code></td>
      </tr>
      <tr>
        <td>user </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>dnd_status </td>
        <td>
          object
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>dnd_status.dnd_enabled </td>
        <td>
          boolean
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>dnd_status.next_dnd_start_ts </td>
        <td>
          number
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>dnd_status.next_dnd_end_ts </td>
        <td>
          number
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>



#### Event #17 
The workspace email domain has changed.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>email_domain_changed</code></td>
      </tr>
      <tr>
        <td>email_domain </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>event_ts </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>



#### Event #18 
A custom emoji has been removed.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>emoji_changed</code></td>
      </tr>
      <tr>
        <td>subtype </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>remove</code></td>
      </tr>
      <tr>
        <td>names </td>
        <td>
          array(string)
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>event_ts </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>



#### Event #19 
A custom emoji has been added.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>emoji_changed</code></td>
      </tr>
      <tr>
        <td>subtype </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>add</code></td>
      </tr>
      <tr>
        <td>name </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>value </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>event_ts </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>



#### Event #20 
A file was changed.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>file_change</code></td>
      </tr>
      <tr>
        <td>file_id </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>file </td>
        <td>
          object
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>file.id </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>



#### Event #21 
A file comment was added.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>file_comment_added</code></td>
      </tr>
      <tr>
        <td>comment </td>
        <td>
          
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>file_id </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>file </td>
        <td>
          object
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>file.id </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>



#### Event #22 
A file comment was deleted.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>file_comment_deleted</code></td>
      </tr>
      <tr>
        <td>comment </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>file_id </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>file </td>
        <td>
          object
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>file.id </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>



#### Event #23 
A file comment was edited.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>file_comment_edited</code></td>
      </tr>
      <tr>
        <td>comment </td>
        <td>
          
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>file_id </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>file </td>
        <td>
          object
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>file.id </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>



#### Event #24 
A file was created.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>file_created</code></td>
      </tr>
      <tr>
        <td>file_id </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>file </td>
        <td>
          object
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>file.id </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>



#### Event #25 
A file was deleted.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>file_deleted</code></td>
      </tr>
      <tr>
        <td>file_id </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>event_ts </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>



#### Event #26 
A file was made public.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>file_public</code></td>
      </tr>
      <tr>
        <td>file_id </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>file </td>
        <td>
          object
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>file.id </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>



#### Event #27 
A file was shared.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>file_shared</code></td>
      </tr>
      <tr>
        <td>file_id </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>file </td>
        <td>
          object
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>file.id </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>



#### Event #28 
A file was unshared.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>file_unshared</code></td>
      </tr>
      <tr>
        <td>file_id </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>file </td>
        <td>
          object
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>file.id </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>



#### Event #29 
The server intends to close the connection soon.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>goodbye</code></td>
      </tr>
  </tbody>
</table>



#### Event #30 
A private channel was archived.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>group_archive</code></td>
      </tr>
      <tr>
        <td>channel </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>



#### Event #31 
You closed a private channel.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>group_close</code></td>
      </tr>
      <tr>
        <td>user </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>channel </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>



#### Event #32 
Bulk updates were made to a private channel's history.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>group_history_changed</code></td>
      </tr>
      <tr>
        <td>latest </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>ts </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>event_ts </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>



#### Event #33 
You joined a private channel.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>group_joined</code></td>
      </tr>
      <tr>
        <td>channel </td>
        <td>
          object
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>channel.id </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>channel.name </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>channel.created </td>
        <td>
          number
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>channel.creator </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>



#### Event #34 
You left a private channel.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>group_left</code></td>
      </tr>
      <tr>
        <td>channel </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>



#### Event #35 
A private channel read marker was updated.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>group_marked</code></td>
      </tr>
      <tr>
        <td>channel </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>ts </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>



#### Event #36 
You opened a private channel.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>group_open</code></td>
      </tr>
      <tr>
        <td>user </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>channel </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>



#### Event #37 
A private channel was renamed.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>group_rename</code></td>
      </tr>
      <tr>
        <td>channel </td>
        <td>
          object
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>channel.id </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>channel.name </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>channel.created </td>
        <td>
          number
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>



#### Event #38 
A private channel was unarchived.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>group_unarchive</code></td>
      </tr>
      <tr>
        <td>channel </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>user </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>



#### Event #39 
You closed a DM.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>im_close</code></td>
      </tr>
      <tr>
        <td>channel </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>user </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>



#### Event #40 
A DM was created.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>im_created</code></td>
      </tr>
      <tr>
        <td>channel </td>
        <td>
          object
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>channel.id </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>channel.name </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>channel.created </td>
        <td>
          number
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>channel.creator </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>user </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>



#### Event #41 
A direct message read marker was updated.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>im_marked</code></td>
      </tr>
      <tr>
        <td>channel </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>ts </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>



#### Event #42 
You opened a DM.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>im_open</code></td>
      </tr>
      <tr>
        <td>channel </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>user </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>



#### Event #43 
You manually updated your presence.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>manual_presence_change</code></td>
      </tr>
      <tr>
        <td>presence </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>



#### Event #44 
A user joined a public or private channel.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>member_joined_channel</code></td>
      </tr>
      <tr>
        <td>user </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>channel </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>channel_type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>C</code>, <code>G</code></td>
      </tr>
      <tr>
        <td>team </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>inviter </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>



#### Event #45 
A message was sent to a channel.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>message</code></td>
      </tr>
      <tr>
        <td>user </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>channel </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>text </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>ts </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>attachments </td>
        <td>
          array(object)
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>attachments.fallback </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>attachments.color </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>attachments.pretext </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>attachments.author_name </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>attachments.author_link </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>attachments.author_icon </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>attachments.title </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>attachments.title_link </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>attachments.text </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>attachments.fields </td>
        <td>
          array(object)
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>attachments.fields.title </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>attachments.fields.value </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>attachments.fields.short </td>
        <td>
          boolean
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>attachments.image_url </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>attachments.thumb_url </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>attachments.footer </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>attachments.footer_icon </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>attachments.ts </td>
        <td>
          number
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>edited </td>
        <td>
          object
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>edited.user </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>edited.ts </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>




### <a id="events-send"/>Events a client can send:
#### Event #0 
A message was sent to a channel.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>id </td>
        <td>
          number
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>message</code></td>
      </tr>
      <tr>
        <td>channel </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>text </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>




## Messages

### hello 
First event received upon connection.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>hello</code></td>
      </tr>
  </tbody>
</table>


##### Example of payload _(generated)_

```json
{
  "type": "hello"
}
```

### connectionError 
Event received when a connection error happens.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>error</code></td>
      </tr>
      <tr>
        <td>error </td>
        <td>
          object
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>error.code </td>
        <td>
          number
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>error.msg </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example of payload _(generated)_

```json
{
  "type": "error",
  "error": {
    "code": 0,
    "msg": "string"
  }
}
```

### accountsChanged 
The list of accounts a user is signed into has changed.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>accounts_changed</code></td>
      </tr>
  </tbody>
</table>


##### Example of payload _(generated)_

```json
{
  "type": "accounts_changed"
}
```

### botAdded 
A bot user was added.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>bot_added</code></td>
      </tr>
      <tr>
        <td>bot </td>
        <td>
          object
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>bot.id </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>bot.app_id </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>bot.name </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>bot.icons </td>
        <td>
          object
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example of payload _(generated)_

```json
{
  "type": "bot_added",
  "bot": {
    "id": "string",
    "app_id": "string",
    "name": "string",
    "icons": {
      "property1": "string",
      "property2": "string"
    }
  }
}
```

### botChanged 
A bot user was changed.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>bot_added</code></td>
      </tr>
      <tr>
        <td>bot </td>
        <td>
          object
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>bot.id </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>bot.app_id </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>bot.name </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>bot.icons </td>
        <td>
          object
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example of payload _(generated)_

```json
{
  "type": "bot_added",
  "bot": {
    "id": "string",
    "app_id": "string",
    "name": "string",
    "icons": {
      "property1": "string",
      "property2": "string"
    }
  }
}
```

### channelArchive 
A channel was archived.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>channel_archive</code></td>
      </tr>
      <tr>
        <td>channel </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>user </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example of payload _(generated)_

```json
{
  "type": "channel_archive",
  "channel": "string",
  "user": "string"
}
```

### channelCreated 
A channel was created.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>channel_created</code></td>
      </tr>
      <tr>
        <td>channel </td>
        <td>
          object
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>channel.id </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>channel.name </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>channel.created </td>
        <td>
          number
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>channel.creator </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example of payload _(generated)_

```json
{
  "type": "channel_created",
  "channel": {
    "id": "string",
    "name": "string",
    "created": 0,
    "creator": "string"
  }
}
```

### channelDeleted 
A channel was deleted.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>channel_deleted</code></td>
      </tr>
      <tr>
        <td>channel </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example of payload _(generated)_

```json
{
  "type": "channel_deleted",
  "channel": "string"
}
```

### channelHistoryChanged 
Bulk updates were made to a channel's history.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>channel_history_changed</code></td>
      </tr>
      <tr>
        <td>latest </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>ts </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>event_ts </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example of payload _(generated)_

```json
{
  "type": "channel_history_changed",
  "latest": "string",
  "ts": "string",
  "event_ts": "string"
}
```

### channelJoined 
You joined a channel.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>channel_joined</code></td>
      </tr>
      <tr>
        <td>channel </td>
        <td>
          object
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>channel.id </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>channel.name </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>channel.created </td>
        <td>
          number
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>channel.creator </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example of payload _(generated)_

```json
{
  "type": "channel_joined",
  "channel": {
    "id": "string",
    "name": "string",
    "created": 0,
    "creator": "string"
  }
}
```

### channelLeft 
You left a channel.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>channel_left</code></td>
      </tr>
      <tr>
        <td>channel </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example of payload _(generated)_

```json
{
  "type": "channel_left",
  "channel": "string"
}
```

### channelMarked 
Your channel read marker was updated.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>channel_marked</code></td>
      </tr>
      <tr>
        <td>channel </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>ts </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example of payload _(generated)_

```json
{
  "type": "channel_marked",
  "channel": "string",
  "ts": "string"
}
```

### channelRename 
A channel was renamed.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>channel_rename</code></td>
      </tr>
      <tr>
        <td>channel </td>
        <td>
          object
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>channel.id </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>channel.name </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>channel.created </td>
        <td>
          number
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example of payload _(generated)_

```json
{
  "type": "channel_rename",
  "channel": {
    "id": "string",
    "name": "string",
    "created": 0
  }
}
```

### channelUnarchive 
A channel was unarchived.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>channel_unarchive</code></td>
      </tr>
      <tr>
        <td>channel </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>user </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example of payload _(generated)_

```json
{
  "type": "channel_unarchive",
  "channel": "string",
  "user": "string"
}
```

### commandsChanged 
A slash command has been added or changed.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>commands_changed</code></td>
      </tr>
      <tr>
        <td>event_ts </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example of payload _(generated)_

```json
{
  "type": "commands_changed",
  "event_ts": "string"
}
```

### dndUpdated 
Do not Disturb settings changed for the current user.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>dnd_updated</code></td>
      </tr>
      <tr>
        <td>user </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>dnd_status </td>
        <td>
          object
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>dnd_status.dnd_enabled </td>
        <td>
          boolean
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>dnd_status.next_dnd_start_ts </td>
        <td>
          number
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>dnd_status.next_dnd_end_ts </td>
        <td>
          number
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>dnd_status.snooze_enabled </td>
        <td>
          boolean
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>dnd_status.snooze_endtime </td>
        <td>
          number
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example of payload _(generated)_

```json
{
  "type": "dnd_updated",
  "user": "string",
  "dnd_status": {
    "dnd_enabled": true,
    "next_dnd_start_ts": 0,
    "next_dnd_end_ts": 0,
    "snooze_enabled": true,
    "snooze_endtime": 0
  }
}
```

### dndUpdatedUser 
Do not Disturb settings changed for a member.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>dnd_updated_user</code></td>
      </tr>
      <tr>
        <td>user </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>dnd_status </td>
        <td>
          object
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>dnd_status.dnd_enabled </td>
        <td>
          boolean
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>dnd_status.next_dnd_start_ts </td>
        <td>
          number
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>dnd_status.next_dnd_end_ts </td>
        <td>
          number
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example of payload _(generated)_

```json
{
  "type": "dnd_updated_user",
  "user": "string",
  "dnd_status": {
    "dnd_enabled": true,
    "next_dnd_start_ts": 0,
    "next_dnd_end_ts": 0
  }
}
```

### emailDomainChanged 
The workspace email domain has changed.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>email_domain_changed</code></td>
      </tr>
      <tr>
        <td>email_domain </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>event_ts </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example of payload _(generated)_

```json
{
  "type": "email_domain_changed",
  "email_domain": "string",
  "event_ts": "string"
}
```

### emojiRemoved 
A custom emoji has been removed.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>emoji_changed</code></td>
      </tr>
      <tr>
        <td>subtype </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>remove</code></td>
      </tr>
      <tr>
        <td>names </td>
        <td>
          array(string)
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>event_ts </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example of payload _(generated)_

```json
{
  "type": "emoji_changed",
  "subtype": "remove",
  "names": [
    "string"
  ],
  "event_ts": "string"
}
```

### emojiAdded 
A custom emoji has been added.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>emoji_changed</code></td>
      </tr>
      <tr>
        <td>subtype </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>add</code></td>
      </tr>
      <tr>
        <td>name </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>value </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>event_ts </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example of payload _(generated)_

```json
{
  "type": "emoji_changed",
  "subtype": "add",
  "name": "string",
  "value": "http://example.com",
  "event_ts": "string"
}
```

### fileChange 
A file was changed.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>file_change</code></td>
      </tr>
      <tr>
        <td>file_id </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>file </td>
        <td>
          object
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>file.id </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example of payload _(generated)_

```json
{
  "type": "file_change",
  "file_id": "string",
  "file": {
    "id": "string"
  }
}
```

### fileCommentAdded 
A file comment was added.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>file_comment_added</code></td>
      </tr>
      <tr>
        <td>comment </td>
        <td>
          
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>file_id </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>file </td>
        <td>
          object
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>file.id </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example of payload _(generated)_

```json
{
  "type": "file_comment_added",
  "comment": null,
  "file_id": "string",
  "file": {
    "id": "string"
  }
}
```

### fileCommentDeleted 
A file comment was deleted.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>file_comment_deleted</code></td>
      </tr>
      <tr>
        <td>comment </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>file_id </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>file </td>
        <td>
          object
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>file.id </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example of payload _(generated)_

```json
{
  "type": "file_comment_deleted",
  "comment": "string",
  "file_id": "string",
  "file": {
    "id": "string"
  }
}
```

### fileCommentEdited 
A file comment was edited.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>file_comment_edited</code></td>
      </tr>
      <tr>
        <td>comment </td>
        <td>
          
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>file_id </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>file </td>
        <td>
          object
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>file.id </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example of payload _(generated)_

```json
{
  "type": "file_comment_edited",
  "comment": null,
  "file_id": "string",
  "file": {
    "id": "string"
  }
}
```

### fileCreated 
A file was created.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>file_created</code></td>
      </tr>
      <tr>
        <td>file_id </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>file </td>
        <td>
          object
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>file.id </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example of payload _(generated)_

```json
{
  "type": "file_created",
  "file_id": "string",
  "file": {
    "id": "string"
  }
}
```

### fileDeleted 
A file was deleted.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>file_deleted</code></td>
      </tr>
      <tr>
        <td>file_id </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>event_ts </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example of payload _(generated)_

```json
{
  "type": "file_deleted",
  "file_id": "string",
  "event_ts": "string"
}
```

### filePublic 
A file was made public.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>file_public</code></td>
      </tr>
      <tr>
        <td>file_id </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>file </td>
        <td>
          object
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>file.id </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example of payload _(generated)_

```json
{
  "type": "file_public",
  "file_id": "string",
  "file": {
    "id": "string"
  }
}
```

### fileShared 
A file was shared.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>file_shared</code></td>
      </tr>
      <tr>
        <td>file_id </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>file </td>
        <td>
          object
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>file.id </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example of payload _(generated)_

```json
{
  "type": "file_shared",
  "file_id": "string",
  "file": {
    "id": "string"
  }
}
```

### fileUnshared 
A file was unshared.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>file_unshared</code></td>
      </tr>
      <tr>
        <td>file_id </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>file </td>
        <td>
          object
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>file.id </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example of payload _(generated)_

```json
{
  "type": "file_unshared",
  "file_id": "string",
  "file": {
    "id": "string"
  }
}
```

### goodbye 
The server intends to close the connection soon.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>goodbye</code></td>
      </tr>
  </tbody>
</table>


##### Example of payload _(generated)_

```json
{
  "type": "goodbye"
}
```

### groupArchive 
A private channel was archived.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>group_archive</code></td>
      </tr>
      <tr>
        <td>channel </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example of payload _(generated)_

```json
{
  "type": "group_archive",
  "channel": "string"
}
```

### groupClose 
You closed a private channel.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>group_close</code></td>
      </tr>
      <tr>
        <td>user </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>channel </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example of payload _(generated)_

```json
{
  "type": "group_close",
  "user": "string",
  "channel": "string"
}
```

### groupHistoryChanged 
Bulk updates were made to a private channel's history.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>group_history_changed</code></td>
      </tr>
      <tr>
        <td>latest </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>ts </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>event_ts </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example of payload _(generated)_

```json
{
  "type": "group_history_changed",
  "latest": "string",
  "ts": "string",
  "event_ts": "string"
}
```

### groupJoined 
You joined a private channel.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>group_joined</code></td>
      </tr>
      <tr>
        <td>channel </td>
        <td>
          object
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>channel.id </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>channel.name </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>channel.created </td>
        <td>
          number
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>channel.creator </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example of payload _(generated)_

```json
{
  "type": "group_joined",
  "channel": {
    "id": "string",
    "name": "string",
    "created": 0,
    "creator": "string"
  }
}
```

### groupLeft 
You left a private channel.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>group_left</code></td>
      </tr>
      <tr>
        <td>channel </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example of payload _(generated)_

```json
{
  "type": "group_left",
  "channel": "string"
}
```

### groupMarked 
A private channel read marker was updated.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>group_marked</code></td>
      </tr>
      <tr>
        <td>channel </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>ts </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example of payload _(generated)_

```json
{
  "type": "group_marked",
  "channel": "string",
  "ts": "string"
}
```

### groupOpen 
You opened a private channel.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>group_open</code></td>
      </tr>
      <tr>
        <td>user </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>channel </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example of payload _(generated)_

```json
{
  "type": "group_open",
  "user": "string",
  "channel": "string"
}
```

### groupRename 
A private channel was renamed.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>group_rename</code></td>
      </tr>
      <tr>
        <td>channel </td>
        <td>
          object
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>channel.id </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>channel.name </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>channel.created </td>
        <td>
          number
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example of payload _(generated)_

```json
{
  "type": "group_rename",
  "channel": {
    "id": "string",
    "name": "string",
    "created": 0
  }
}
```

### groupUnarchive 
A private channel was unarchived.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>group_unarchive</code></td>
      </tr>
      <tr>
        <td>channel </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>user </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example of payload _(generated)_

```json
{
  "type": "group_unarchive",
  "channel": "string",
  "user": "string"
}
```

### imClose 
You closed a DM.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>im_close</code></td>
      </tr>
      <tr>
        <td>channel </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>user </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example of payload _(generated)_

```json
{
  "type": "im_close",
  "channel": "string",
  "user": "string"
}
```

### imCreated 
A DM was created.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>im_created</code></td>
      </tr>
      <tr>
        <td>channel </td>
        <td>
          object
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>channel.id </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>channel.name </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>channel.created </td>
        <td>
          number
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>channel.creator </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>user </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example of payload _(generated)_

```json
{
  "type": "im_created",
  "channel": {
    "id": "string",
    "name": "string",
    "created": 0,
    "creator": "string"
  },
  "user": "string"
}
```

### imMarked 
A direct message read marker was updated.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>im_marked</code></td>
      </tr>
      <tr>
        <td>channel </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>ts </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example of payload _(generated)_

```json
{
  "type": "im_marked",
  "channel": "string",
  "ts": "string"
}
```

### imOpen 
You opened a DM.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>im_open</code></td>
      </tr>
      <tr>
        <td>channel </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>user </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example of payload _(generated)_

```json
{
  "type": "im_open",
  "channel": "string",
  "user": "string"
}
```

### manualPresenceChange 
You manually updated your presence.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>manual_presence_change</code></td>
      </tr>
      <tr>
        <td>presence </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example of payload _(generated)_

```json
{
  "type": "manual_presence_change",
  "presence": "string"
}
```

### memberJoinedChannel 
A user joined a public or private channel.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>member_joined_channel</code></td>
      </tr>
      <tr>
        <td>user </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>channel </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>channel_type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>C</code>, <code>G</code></td>
      </tr>
      <tr>
        <td>team </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>inviter </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example of payload _(generated)_

```json
{
  "type": "member_joined_channel",
  "user": "string",
  "channel": "string",
  "channel_type": "C",
  "team": "string",
  "inviter": "string"
}
```

### memberLeftChannel 
A user left a public or private channel.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>member_left_channel</code></td>
      </tr>
      <tr>
        <td>user </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>channel </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>channel_type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>C</code>, <code>G</code></td>
      </tr>
      <tr>
        <td>team </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example of payload _(generated)_

```json
{
  "type": "member_left_channel",
  "user": "string",
  "channel": "string",
  "channel_type": "C",
  "team": "string"
}
```

### message 
A message was sent to a channel.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>message</code></td>
      </tr>
      <tr>
        <td>user </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>channel </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>text </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>ts </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>attachments </td>
        <td>
          array(object)
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>attachments.fallback </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>attachments.color </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>attachments.pretext </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>attachments.author_name </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>attachments.author_link </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>attachments.author_icon </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>attachments.title </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>attachments.title_link </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>attachments.text </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>attachments.fields </td>
        <td>
          array(object)
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>attachments.fields.title </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>attachments.fields.value </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>attachments.fields.short </td>
        <td>
          boolean
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>attachments.image_url </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>attachments.thumb_url </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>attachments.footer </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>attachments.footer_icon </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>attachments.ts </td>
        <td>
          number
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>edited </td>
        <td>
          object
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>edited.user </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>edited.ts </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example of payload _(generated)_

```json
{
  "type": "message",
  "user": "string",
  "channel": "string",
  "text": "string",
  "ts": "string",
  "attachments": [
    {
      "fallback": "string",
      "color": "string",
      "pretext": "string",
      "author_name": "string",
      "author_link": "http://example.com",
      "author_icon": "http://example.com",
      "title": "string",
      "title_link": "http://example.com",
      "text": "string",
      "fields": [
        {
          "title": "string",
          "value": "string",
          "short": true
        }
      ],
      "image_url": "http://example.com",
      "thumb_url": "http://example.com",
      "footer": "string",
      "footer_icon": "http://example.com",
      "ts": 0
    }
  ],
  "edited": {
    "user": "string",
    "ts": "string"
  }
}
```

### outgoingMessage 
A message was sent to a channel.




#### Payload


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>id </td>
        <td>
          number
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>type </td>
        <td>
          string
        </td>
        <td></td>
        <td><code>message</code></td>
      </tr>
      <tr>
        <td>channel </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>text </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example of payload _(generated)_

```json
{
  "id": 0,
  "type": "message",
  "channel": "string",
  "text": "string"
}
```


## Schemas

#### attachment

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>fallback </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>color </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>pretext </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>author_name </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>author_link </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>author_icon </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>title </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>title_link </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>text </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>fields </td>
        <td>
          array(object)
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>fields.title </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>fields.value </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>fields.short </td>
        <td>
          boolean
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>image_url </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>thumb_url </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>footer </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>footer_icon </td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>ts </td>
        <td>
          number
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>

##### Example _(generated)_

```json
{
  "fallback": "string",
  "color": "string",
  "pretext": "string",
  "author_name": "string",
  "author_link": "http://example.com",
  "author_icon": "http://example.com",
  "title": "string",
  "title_link": "http://example.com",
  "text": "string",
  "fields": [
    {
      "title": "string",
      "value": "string",
      "short": true
    }
  ],
  "image_url": "http://example.com",
  "thumb_url": "http://example.com",
  "footer": "string",
  "footer_icon": "http://example.com",
  "ts": 0
}
```
