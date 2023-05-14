import React from "react";
//* CSS
import "../../../css/header/contact/contact.css";
//* FONT AWESOME
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faTwitter,
  faInstagram,
  faYoutube,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

const Contact = () => {
  const icons = [
    faFacebookF,
    faTwitter,
    faInstagram,
    faYoutube,
    faGithub,
    faEnvelope,
  ];

  return (
    <section id="contact-section">
      {icons.map((icon, i) => (
        <article
          key={`contact-article-${i}`}
          id="contact-article"
          className="icon"
        >
          <a href="#">
            <FontAwesomeIcon icon={icon} className="icon contact-icon" />
          </a>
        </article>
      ))}
    </section>
  );
};

export default Contact;
