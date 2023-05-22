//* NPMS
import $ from "jquery";
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
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";

const Contact = () => {
  // FONT AWESOME ICON NAMES
  const icons = [
    faFacebookF,
    faTwitter,
    faInstagram,
    faYoutube,
    faGithub,
    faLinkedin,
  ];
  // SOCIAL LINKS
  const socialLinks = [
    "https://www.facebook.com/cptemre95",
    "https://twitter.com/emrekunduraci",
    "https://www.instagram.com/cptemre95",
    "https://www.youtube.com/channel/UCuXBNQpcptwS7mzy5KbRLQg",
    "https://github.com/cptemre",
    "https://www.linkedin.com/in/cptemre",
  ];
  return (
    <section id="contact-section">
      {icons.map((icon, i) => (
        <article
          key={`contact-article-${i}`}
          id="contact-article"
          className="icon"
        >
          <a
            href={socialLinks[i]}
            target="_blank"
            onMouseEnter={(e) =>
              $(e.currentTarget).children(".icon").css({
                fontSize: "2rem",
              })
            }
            onMouseLeave={(e) =>
              $(e.currentTarget).children(".icon").css({
                fontSize: "1.5rem",
              })
            }
          >
            <FontAwesomeIcon icon={icon} className="icon contact-icon" />
          </a>
        </article>
      ))}
    </section>
  );
};

export default Contact;
