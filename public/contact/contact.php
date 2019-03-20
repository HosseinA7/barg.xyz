<?php
  $name = $_POST['name'];
  $visitor_email = $_POST['email'];
  $subject = $_POST['subject'];
  $message = $_POST['message'];


  $email_form = 'my@jv-kmi.ir';

  $email_subject = "New Form Submission";

  $email_body = "User Name: $name.\n".
                  "User Email: $visitor_email.\n\n".
                    "User Subject: $subject.\n\n".
                      "User Message: $message.\n";

  $to = "my@jv-kmi.ir";

  $headers = "Form: $email_form \r\n";

  $headers .="Reply-To: $visitor_email \r\n";

  mail($to,$email_subject,$email_body,$headers);
  header("Location: index.html#contact");

 ?>
