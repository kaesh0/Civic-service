import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import IndiaMap from "../components/IndiaMap.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { FiUser, FiMenu, FiX, FiInfo, FiHelpCircle, FiPhone } from "react-icons/fi";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const reports = JSON.parse(localStorage.getItem("reports") || "[]");

  const quotes = [
    {
      id: 1,
      text: "Civic sense begins with small acts – dispose, don't litter.",
      author: "Civic Service",
      image: "https://images.unsplash.com/photo-1492496913980-501348b61469?q=80&w=1600&auto=format&fit=crop"
    },
    {
      id: 2,
      text: "Your street is your responsibility. Keep it clean, keep it safe.",
      author: "Civic Service",
      image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?q=80&w=1600&auto=format&fit=crop"
    },
    {
      id: 3,
      text: "Report issues. Raise your voice. Shape your neighbourhood.",
      author: "Civic Service",
      image: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?q=80&w=1600&auto=format&fit=crop"
    },
    {
      id: 4,
      text: "Follow rules on the road and online – respect is civic duty.",
      author: "Civic Service",
      image: "https://images.unsplash.com/photo-1456534231849-7d5fcd82d77b?q=80&w=1600&auto=format&fit=crop"
    },
    {
      id: 5,
      text: "Plant a tree, protect a life – stewardship is civic sense.",
      author: "Civic Service",
      image: "https://images.unsplash.com/photo-1492496913980-6f7c1a3eae4e?q=80&w=1600&auto=format&fit=crop"
    },
    {
      id: 6,
      text: "Public spaces are shared spaces – treat them like home.",
      author: "Civic Service",
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1600&auto=format&fit=crop"
    },
    {
      id: 7,
      text: "Small complaints fix big problems. Report today.",
      author: "Civic Service",
      image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1600&auto=format&fit=crop"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [quotes.length]);

  const goTo = (index) => {
    setCurrentSlide(((index % quotes.length) + quotes.length) % quotes.length);
  };
  const next = () => goTo(currentSlide + 1);
  const prev = () => goTo(currentSlide - 1);

  function getInitials(name) {
    if (!name || typeof name !== 'string') return 'U';
    const parts = name.trim().split(/\s+/).filter(Boolean);
    const first = parts[0] ? parts[0][0] : '';
    const second = parts[1] ? parts[1][0] : '';
    const initials = `${first}${second}`.toUpperCase();
    return initials || 'U';
  }

  

  const handleAboutClick = () => {
    // You can create an About page later
    alert("About page coming soon!");
  };

  const handleHelpClick = () => {
    navigate("/help");
  };

  const handleHelplineClick = () => {
    navigate("/helpline");
  };

  return (
    <div className="homePage">
      {/* Portfolio Wrapper - Fixed 16:9 Container */}
      <div className="portfolio-wrapper">
        {/* Portfolio Content - Scrollable Area */}
        <div className="portfolio-content">
          {/* Navbar */}
          <nav className="navbar">
            <div className="navbarContainer">
              {/* Logo and Brand */}
              <div className="navbarBrand" onClick={() => navigate("/home")}>
                <div className="brandLogo">🏛️</div>
                <span className="brandName">Civic Service</span>
              </div>

              {/* Desktop Menu */}
              <div className="navbarMenu">
                <button className="navbarItem" onClick={handleAboutClick}>
                  <FiInfo className="navbarIcon" />
                  <span>About</span>
                </button>
                <button className="navbarItem" onClick={handleHelpClick}>
                  <FiHelpCircle className="navbarIcon" />
                  <span>Help</span>
                </button>
                <button className="navbarItem" onClick={handleHelplineClick}>
                  <FiPhone className="navbarIcon" />
                  <span>Helpline</span>
                </button>
                
                {/* Profile Section */}
                <div className="profileSection">
                  {user ? (
                    <button className="profileButton" onClick={() => navigate("/profile")}> 
                      <div className="profileAvatar">
                        <span className="avatarInitials">{getInitials(user.name)}</span>
                      </div>
                      <span className="profileName">{user.name}</span>
                    </button>
                  ) : (
                    <button className="loginButton" onClick={() => navigate("/login")}>
                      <FiUser className="loginIcon" />
                      <span>Login</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button 
                className="mobileMenuButton" 
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                {showMobileMenu ? <FiX /> : <FiMenu />}
              </button>
            </div>

            {/* Mobile Menu */}
            {showMobileMenu && (
              <div className="mobileMenu">
                <button className="mobileMenuItem" onClick={handleAboutClick}>
                  <FiInfo className="mobileMenuIcon" />
                  <span>About</span>
                </button>
                <button className="mobileMenuItem" onClick={handleHelpClick}>
                  <FiHelpCircle className="mobileMenuIcon" />
                  <span>Help</span>
                </button>
                <button className="mobileMenuItem" onClick={handleHelplineClick}>
                  <FiPhone className="mobileMenuIcon" />
                  <span>Helpline</span>
                </button>
                {user ? (
                  <button className="mobileMenuItem" onClick={() => {
                    navigate("/profile");
                    setShowMobileMenu(false);
                  }}>
                    <FiUser className="mobileMenuIcon" />
                    <span>Profile</span>
                  </button>
                ) : (
                  <button className="mobileMenuItem" onClick={() => {
                    navigate("/login");
                    setShowMobileMenu(false);
                  }}>
                    <FiUser className="mobileMenuIcon" />
                    <span>Login</span>
                  </button>
                )}
              </div>
            )}
          </nav>

          {/* Main Content */}
          <div className="page">
        <section className="quoteCarousel">
          <div className="carouselHeader">
            <h1 className="carouselTitle">Civic Sense Quotes</h1>
          </div>

          <div className="carouselViewport">
            <div
              className="carouselTrack"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {quotes.map((q) => (
                <div key={q.id} className="quoteCard">
                  <div className="quoteBg" style={{ backgroundImage: `url(${q.image})` }} />
                  <div className="quoteOverlay" />
                  <div className="quoteContent">
                    <div className="quoteMark">“</div>
                    <p className="quoteText">{q.text}</p>
                    <div className="quoteFooter">— {q.author}</div>
                  </div>
                </div>
              ))}
            </div>

            <button className="navButton prev" aria-label="Previous" onClick={prev}>‹</button>
            <button className="navButton next" aria-label="Next" onClick={next}>›</button>
          </div>

          <div className="carouselDots">
            {quotes.map((q, i) => (
              <button
                key={q.id}
                className={`dot ${i === currentSlide ? "active" : ""}`}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        </section>

        {/* Community CTA */}
        <section className="section">
          <div className="communityCta">
            <div className="ctaText">
              <h2 className="sectionTitle" style={{ margin: 0 }}>See issues in your locality</h2>
              <p style={{ margin: 0, color: 'var(--text-600)' }}>Explore the community feed to discover problems around you and their status.</p>
            </div>
            <button className="btn primary" onClick={() => navigate('/community')}>Go to Community</button>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="section">
          <h2 className="sectionTitle">Quick Actions</h2>
          <div className="quickGrid">
            <button className="quickTile" onClick={() => navigate('/report')}>
              <div className="quickEmoji">📝</div>
              <div className="quickLabel">New Report</div>
            </button>
            <button className="quickTile" onClick={() => navigate('/my-tickets')}>
              <div className="quickEmoji">🎫</div>
              <div className="quickLabel">My Tickets</div>
            </button>
            <button className="quickTile" onClick={() => navigate('/leaderboard')}>
              <div className="quickEmoji">🏆</div>
              <div className="quickLabel">Leaderboard</div>
            </button>
            <button className="quickTile" onClick={() => navigate('/help')}>
              <div className="quickEmoji">❓</div>
              <div className="quickLabel">Help</div>
            </button>
          </div>
        </section>

        {/* Impact Counters */}
        <section className="section">
          <h2 className="sectionTitle">Your Impact</h2>
          <div className="impactRow">
            <div className="impactCard">
              <div className="impactValue">{reports.length}</div>
              <div className="impactLabel">Reports in Community</div>
            </div>
            <div className="impactCard">
              <div className="impactValue">{reports.filter(r => (r.status||'') === 'Resolved').length}</div>
              <div className="impactLabel">Resolved</div>
            </div>
            <div className="impactCard">
              <div className="impactValue">{reports.filter(r => (r.status||'').toLowerCase() === 'inprogress').length}</div>
              <div className="impactLabel">In Progress</div>
            </div>
          </div>
        </section>

        <section className="section">
          <h2 className="sectionTitle">Recent Tickets</h2>
          {reports.length === 0 ? (
            <div className="empty">No tickets yet. Create your first report.</div>
          ) : (
            <ul className="ticketList">
              {reports.slice(0, 4).map((r) => (
                <li key={r.id} className="ticketItem">
                  <div className="ticketMain">
                    <div className="ticketTitle">{r.title}</div>
                    <div className={`statusBadge ${r.status.toLowerCase()}`}>{r.status}</div>
                  </div>
                  <div className="ticketMeta">
                    <span>{r.category}</span><span>•</span><span>{r.priority}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
          </div>
        </div>
      </div>
    </div>
  );
}