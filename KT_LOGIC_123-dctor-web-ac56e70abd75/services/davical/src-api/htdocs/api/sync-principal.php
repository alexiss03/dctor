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

header( 'Content-Type: application/json; charset="utf-8"' );

function validatePayload() {
  global $c;

  $email = null;
  $username = null;
  $displayName = null;

  if(isset($_POST['email']) && trim($_POST['email']) !== "") {
    $email=trim($_POST['email']);
  }
  else {
    $c->messages[] = array(
      "path" => "",
      "code" => "required",
      "message" => "must have required property 'email'",
      "info" => array(
          "missingProperty" => "email"
      ),
    );
  }

  if(isset($_POST['id']) && trim($_POST['id']) !== "") {
    $username=trim($_POST['id']);
  }
  else {
    $c->messages[] = array(
      "path" => "",
      "code" => "required",
      "message" => "must have required property 'id'",
      "info" => array(
          "missingProperty" => "id"
      ),
    );
  }

  if(isset($_POST['displayName']) && trim($_POST['displayName']) !== "") {
    $email=trim($_POST['displayName']);
  }
  else {
    $c->messages[] = array(
      "path" => "",
      "code" => "required",
      "message" => "must have required property 'displayName'",
      "info" => array(
          "missingProperty" => "displayName"
      ),
    );
  }

  return array(
    'email' => $email,
    'username' => $username,
    'displayName' => $displayName,
  );
}

// if ( !$session->AllowedTo("Admin" ) ) {
//   @ob_flush(); exit(0);
// }
if( function_exists("sync_user_from_LDAP") && isset($_POST['Sync_LDAP_User'])){
  global $c;
  $data = validatePayload();
  if($c->messages && count($c->messages) > 0) {
    http_response_code(422);
    echo json_encode(
      array(
        'error' => array(
          'statusCode' => 422,
          'name' => 'UnprocessableEntityError',
          'message' => 'The request body is invalid. See error object `details` property for more info.',
          'code' => 'VALIDATION_FAILED',
          'details' => $c->messages,
        ),
      )
    );
    @ob_flush();
    exit(0);
  }

  $principal = new Principal( 'email', $data['email'] );
  $principal->setUsername($data['username']);
  $principal->displayname = $data['displayName'];
  $principal->user_active = true;

  $valid = array();
  $mapping = array();
  $c->default_collections = array(
    array(
      'type' => 'calendar',
      'name' => 'appointments',
      'displayname_suffix' => ' Appointments',
    ),
    array(
      'type' => 'calendar',
      'name' => 'availability',
      'displayname_suffix' => ' Availability',
    ),
    array(
      'type' => 'addressbook',
      'name' => 'addresses',
      'displayname_suffix' => ' Addresses',
    ),
    array(
      'type' => 'addressbook',
      'name' => 'contacts',
      'displayname_suffix' => ' Contacts',
    ),
  );
  sync_user_from_LDAP( $principal, $mapping, $valid );
  
  echo json_encode(
    array(
      'status' => 'ok',
      'msg' => 'Synced user ' . $data['username'],
      'sub' => $data['username'],
      'name' => $data['displayName'],
      'data' => $data['email'],
      'data2' => null,
    )
  );

}
