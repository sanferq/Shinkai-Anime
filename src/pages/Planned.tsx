import { useState, useEffect } from "react";
import { Container, Row, Col, Nav, Tab } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "./pages-css/planned.css";

interface Anime {
  id: number;
  title: string;
  image: string;
}

function Planned() {
  const [planned, setPlanned] = useState<Anime[]>([]);
  const [watching, setWatching] = useState<Anime[]>([]);
  const [completed, setCompleted] = useState<Anime[]>([]);
  const [dropped, setDropped] = useState<Anime[]>([]);

  useEffect(() => {
    setPlanned(JSON.parse(localStorage.getItem("plannedAnime") || "[]"));
    setWatching(JSON.parse(localStorage.getItem("watchingAnime") || "[]"));
    setCompleted(JSON.parse(localStorage.getItem("completedAnime") || "[]"));
    setDropped(JSON.parse(localStorage.getItem("droppedAnime") || "[]"));
  }, []);

  const removeAnime = (category: string, id: number) => {
    let updatedList: Anime[] = [];
    switch (category) {
      case "planned":
        updatedList = planned.filter((anime) => anime.id !== id);
        setPlanned(updatedList);
        localStorage.setItem("plannedAnime", JSON.stringify(updatedList));
        break;
      case "watching":
        updatedList = watching.filter((anime) => anime.id !== id);
        setWatching(updatedList);
        localStorage.setItem("watchingAnime", JSON.stringify(updatedList));
        break;
      case "completed":
        updatedList = completed.filter((anime) => anime.id !== id);
        setCompleted(updatedList);
        localStorage.setItem("completedAnime", JSON.stringify(updatedList));
        break;
      case "dropped":
        updatedList = dropped.filter((anime) => anime.id !== id);
        setDropped(updatedList);
        localStorage.setItem("droppedAnime", JSON.stringify(updatedList));
        break;
      default:
        break;
    }
  };

  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>("completed");

  useEffect(() => {
    const tabFromUrl =
      new URLSearchParams(location.search).get("tab") || "completed";
    setActiveTab(tabFromUrl);
  }, [location]);

  const renderCategory = (title: string, list: Anime[], category: string) => (
    <div>
      <h2 className="text-center">{title}</h2>
      {list.length === 0 ? (
        <p className="text-center">It's empty so far...</p>
      ) : (
        <Row>
          {list.map((anime) => (
            <Col key={anime.id} md={6} lg={4} xl={3} className="mb-3">
              <Link to={`/anime/${anime.id}`} className="text-decoration-none">
                <div className="card card-planned">
                  <img
                    src={anime.image || "/default-anime.jpg"}
                    alt={anime.title}
                    className="card-img-top card-planned-img"
                  />
                  <div className="card-body">
                    <h5 className="card-title text-truncate">{anime.title}</h5>
                  </div>
                </div>
              </Link>
              <div className="card-footer">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    removeAnime(category, anime.id);
                  }}
                  className="btn btn-danger btn-sm w-100"
                >
                  Удалить
                </button>
              </div>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );

  return (
    <Container>
      <h1 className="text-center mb-4">My anime list</h1>
      <Nav
        variant="tabs"
        activeKey={activeTab}
        onSelect={(key) => setActiveTab(key || "completed")}
      >
        <Nav.Item>
          <Nav.Link eventKey="planned">Planned</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="watching">Watching</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="completed">Completed</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="dropped">Dropped</Nav.Link>
        </Nav.Item>
      </Nav>

      <Tab.Container
        activeKey={activeTab}
        onSelect={(key) => setActiveTab(key || "completed")}
      >
        <Row>
          <Col>
            <Tab.Content>
              <Tab.Pane eventKey="planned">
                {renderCategory("Planned", planned, "planned")}
              </Tab.Pane>
              <Tab.Pane eventKey="watching">
                {renderCategory("Watching", watching, "watching")}
              </Tab.Pane>
              <Tab.Pane eventKey="completed">
                {renderCategory("Completed", completed, "completed")}
              </Tab.Pane>
              <Tab.Pane eventKey="dropped">
                {renderCategory("Dropped", dropped, "dropped")}
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
}

export default Planned;
