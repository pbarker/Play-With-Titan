package models

import com.tinkerpop.gremlin.scala._
import controllers.Atlas
import play.api.Logger

/**
 * Created by Grillz on 8/24/14.
 */
case class Relation(name1: String, relation: String, name2: String)

object Relation{
  def save(relation: Relation) = {
    val g = Atlas.getTitanConnection
    if (relation.name1 != "") {
      val ifriend1 = g.V.has("name", relation.name1).toSet()
      val friend1 = ifriend1.head
      val ifriend2 = g.V.has("name", relation.name2).toSet()
      val friend2 = ifriend2.head
      friend1.addEdge(relation.relation, friend2)
      g.commit()
    }
    else Logger.info("Could not find your friend!!!!!!!")
  }
}
