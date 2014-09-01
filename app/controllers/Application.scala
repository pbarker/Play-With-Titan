package controllers


import com.thinkaurelius.titan.core.TitanFactory
import com.tinkerpop.blueprints._
import com.thinkaurelius.titan.core.TitanGraph
import com.tinkerpop.gremlin.scala._
import models._
import org.apache.commons.configuration.BaseConfiguration
import play.api.Logger
import play.api.libs.json._
import play.api.mvc._
import play.api.libs.json.Json
import play.api.libs.json.Json._
import play.api.libs.functional.syntax._
import com.thinkaurelius.titan.core.attribute.Text._
import models.Person


//Atlas object is the graph configuration
object Atlas {
  var g: TitanGraph = null

  def getTitanConf = {
    val conf = new BaseConfiguration();

    conf.setProperty("storage.backend","berkeleyje")
    conf.setProperty("storage.directory","../titandb/local")

    conf.setProperty("index.search.backend", "elasticsearch")
    conf.setProperty("index.search.hostname", "127.0.0.1")      //can't get this to work locally
    conf.setProperty("index.search.elasticsearch.local-mode", "false")
    conf.setProperty("index.search.elasticsearch.client-only", "true")
    conf.setProperty("index.search.elasticsearch.sniff", "false")


    conf
  }

  def getTitanConnection = {
    if (g == null || !g.isOpen()) {
      g = TitanFactory.open(getTitanConf);
    }
    g
  }

  def buildIndex  {
    val g = Atlas.getTitanConnection
    val mgmt = g.getManagementSystem
    val name = mgmt.makePropertyKey("name").dataType(classOf[String]).make
    mgmt.buildIndex("byName", classOf[Vertex]).addKey(name).buildMixedIndex("search")

    mgmt.commit()
  }
}

//All the HTTP meathods
object Application extends Controller {

  def index = Action{
    Ok(views.html.index())
  }

//creates Index on certain properties //only call once before adding values
  def callIndex = Action{
    try {
      Atlas.buildIndex

      Ok("Index Created")
    }
    catch {
      case e:IllegalArgumentException => {
        Logger.info("exception = %s" format e)
        e.printStackTrace();
        BadRequest("Could not create Index!!!!")
      }
      case e:Exception => {
        Logger.info("Could not create Index!!!!")
        Logger.info("exception = %s" format e)
        e.printStackTrace();
        BadRequest(Json.toJson("Could not create Index"))
      }
    }
  }

//test elastic search functionality
  def esTest = Action{
    val g = Atlas.getTitanConnection
    val sString = "J"
    val r = g.V.has("name", CONTAINS_PREFIX, sString)
    val s = r.toList().toString()

    Ok(s)
  }

//retrieve all edges
  def gremlinEdges = Action{
    val g = Atlas.getTitanConnection
    val verty =  g.V.propertyMap.toList.toString()
    val edgy = g.E.toList().toString()

    Ok(edgy)
  }

//retrieve all verts
  def gremlinVerticies = Action{
    val g = Atlas.getTitanConnection
    val verty =  g.V.propertyMap.toList.toString()
    val idVerty = g.V.toList().toString()

    Ok(idVerty)
  }

//retrieve all vert properties
  def vertProps = Action{
    val g = Atlas.getTitanConnection
    val props = g.V.propertyMap.toList().toString()
    Ok(props)
  }

//Json object representation of edge
  def jsonEdges = Action{
    val g = Atlas.getTitanConnection
    //val rawEdgy = g.E.toList()
    val edgy = g.E.map(e =>
      Json.obj(
        "start" -> e.inV.toSet().head.id.asInstanceOf[Long],
        "end" -> e.outV.toSet().head.id.asInstanceOf[Long],
        "label" -> e.label.asInstanceOf[String]
      )
    ).toSet()

    val json = Json.toJson(edgy)
    Ok(json)
  }

//Json object representation of vert
  def jsonVerticies = Action{
    val g = Atlas.getTitanConnection
    //val verty = g.V.toList()
    val allVertNames = g.V.map(v =>
      Json.obj(
        "name" -> v("name").asInstanceOf[String],
        "age" -> v("age").asInstanceOf[Int],
        "id" -> v("id").asInstanceOf[Long]
      )
    ).toSet()

    val json = Json.toJson(allVertNames)
    Ok(json)
  }

//test for finding a specific vertex
  def findVertex = Action{
    val g = Atlas.getTitanConnection
    val newFriend = g.V.has("name", "Karl").toSet()
    val disIt = newFriend.head
    val friend = g.getVertex("name", "Karl")
    //val sFriend = friend.toString
    val nFriend = disIt.toString
    Ok(nFriend)
  }

//find working directory
  def getDirect = Action{
    def getCurrentDirectory = new java.io.File( "." ).getCanonicalPath.toString
    Ok(getCurrentDirectory)
  }

//Json parser for person class
  implicit val personReads: Reads[Person] = (
    (JsPath \ 'name).read[String] and
    (JsPath \ 'age).read[String]
    )(Person.apply _)

//Json parser for relation class
  implicit val relationReads: Reads[Relation] = (
    (JsPath \ 'name1).read[String] and
    (JsPath \ 'relation).read[String] and
    (JsPath \ 'name2).read[String]
    )(Relation.apply _)

//Saves vertex from form
  def saveVert = Action(parse.json) { request =>
    Logger.info("start")
    try {
      val personJson = request.body
      val person = personJson.as[Person]
      Person.save(person)
      val Id = Person.getId(person.name)
      Ok(Json.toJson(Id))
    }
    catch {
      case e:IllegalArgumentException => BadRequest("Could not save Person!!!!")
      case e:Exception => {
        Logger.info("Could not save person!!!!")
        Logger.info("exception = %s" format e)
        BadRequest(Json.toJson("Invalid Format"))
      }
    }
  }

//Saves edge from form
  def saveEdge = Action(parse.json) { request =>
    Logger.info("start")
    try {
      val relationJson = request.body
      val relation = relationJson.as[Relation]
      Relation.save(relation)
      Ok(Json.toJson("Edge Saved"))
    }
    catch {
      case e:IllegalArgumentException => BadRequest("could not save edge!!")
      case e:Exception => {
        Logger.info("Could not save Edge!")
        Logger.info("exception = %s" format e)
        BadRequest(Json.toJson("Invalid Format"))
      }
    }
  }

//test for recieving json form
  def receiveForm =Action(parse.json) {request=>
    val parsed = request.body
    val recieved = "Action recieved"
    val json = Json.toJson(recieved)
    Ok(json)
  }

//test page for websockets
  def ws = Action{
    Ok(views.html.ws())
  }
}
