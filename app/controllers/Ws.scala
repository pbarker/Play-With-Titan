package controllers

import play.api.libs.json.{JsString, JsValue, Json}
import play.api.mvc._
import play.api.libs.iteratee.{Iteratee, Concurrent, Enumerator}
import scala.concurrent.ExecutionContext.Implicits.global
import play.api.Logger
import com.tinkerpop.gremlin.scala._
import com.thinkaurelius.titan.core.attribute.Text._

object Ws extends Controller {

  // http endpoint to check that the server is running
  def index = Action {
    Ok(views.html.ws())
  }

  // endpoint that opens an echo websocket
  def Echo = WebSocket.using[JsValue] {
    request => {
      Logger.info(s"wsEcho, client connected.")
      var channel: Option[Concurrent.Channel[JsValue]] = None
      val outEnumerator: Enumerator[JsValue] = Concurrent.unicast(c => channel = Some(c))

      val inIteratee: Iteratee[JsValue, Unit] = Iteratee.foreach[JsValue](receivedString => {
        // send string back
        Logger.info(s"wsEcho, received: $receivedString")
        val sString = receivedString.as[String]
        val g = Atlas.getTitanConnection
        val results = g.V.has("name", CONTAINS_PREFIX, sString).map(v =>
          v("name").asInstanceOf[String]
        ).toSet()
        val jsResults = Json.toJson(results)
        channel.foreach(_.push(jsResults))
      })

      (inIteratee, outEnumerator)
    }
  }
}
