<?php
/**
* Tools for manipulating calendars
*
* @package   davical
* @subpackage   DAViCalSession
* @author    Maxime Delorme <mdelorme@tennaxia.com>
* @copyright Maxime Delorme
* @license   http://gnu.org/copyleft/gpl.html GNU GPL v2
*/

require_once("./always.php");
// require_once("DAViCalSession.php");
// $session->LoginRequired();

require_once("DataEntry.php");
require_once("classBrowser.php");

require_once("caldav-PUT-functions.php");
include_once('check_UTF8.php');

// if ( !$session->AllowedTo("Admin" ) ) {
//   @ob_flush(); exit(0);
// }
if( function_exists("sync_LDAP") && isset($_POST['Sync_LDAP'])){
  sync_LDAP();
}

if( function_exists("sync_LDAP_groups") && isset($_POST['Sync_LDAP_groups'])){
  sync_LDAP_groups();
}

function get_message($matches)
{

  // as usual: $matches[0] is the complete match
  // $matches[1] the match for the first subpattern
  // enclosed in '##...##' and so on
  // Use like: $s = preg_replace_callback('/##([^#]+)##', 'get_message', $s);
  //  $msg = preg_replace( '/^##(.+)##$/', '$1', $matches[1]);
  $msg = $matches[1];
  if ( strlen($msg) > 30 ) {
    $msg = substr( $msg, 0, 28 ) . '...' ;
  }
  return $msg;
}

class Tools {

  function render(){
    global $c;
    echo $this->renderSyncLDAP();
  }

  static function renderSyncLDAP(){
    global $session, $c, $main_menu, $related_menu;

    header( 'Content-Type: application/json; charset="utf-8"' );

    $response = array();
    if ( isset($c->messages) && is_array($c->messages) && count($c->messages) > 0 ) {
      foreach( $c->messages AS $i => $msg ) {
        $msg = preg_replace_callback("/##([^#]+)##/", "get_message", translate($msg));
        $response[] = array(
          'message' => $msg
        );
      }
    }
    return json_encode($response);
  }
}

$Tools = new Tools();

$Tools->render();
