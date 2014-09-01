package models

/**
 * Created by Grillz on 8/17/14.
 */
import com.tinkerpop.gremlin.scala._
import controllers.Atlas

case class Person(name: String, age: String)


object Person{
  def save(person: Person){
    val g = Atlas.getTitanConnection
    val r = g.addVertexWithLabel("Person")
    r.addProperty("name", person.name)
//    people.addProperty("name", person.name)
    r.addProperty("age", person.age.toInt)
    g.commit()
  }
  def getId(name: String): Long ={
    val g = Atlas.getTitanConnection
    val ifriend1 = g.V.has("name", name).toSet()
    val friend1 = ifriend1.head
    val id = friend1.getId
    id.asInstanceOf[Long]
  }



}