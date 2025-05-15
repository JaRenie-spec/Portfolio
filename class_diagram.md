```mermaid
classDiagram
direction TB
class baseModel{
-id : str
+created at : time
+updated at : time
}
class SuperAdmin{
+id
+name
#password
~def create_admin()
~def update_admin()
~def delete_admin()
}
class admin{
+id
+name
#password
~def create_user()
~def update_user()
~def delete_user()
~def create_author()
~def update_author()
~def delete_author()
~def create_modo()
~def update_modo()
~def delete_modo()
~def create_book()
~def update_book()
~def delete_book()
~def create_event()
~def update_event()
~def delete_event()
~def create_review()
~def update_review()
~def delete_review()
~def view_stats()
~def list_author()
~def list_book()
~def list_user()
~def list_review()
~def list_book_owned_by_user()
~def list_book_owned_by_author()
}
class author{
+id
+first name
+last name
+pseudo
+email
#password
+achat
+favoris
+bio
+link
~def create_author()
~def update_author()
~def delete_author()
~def list_author()
~def list_book()
~def view_stats()
~def create_event()
~def create_news()
~def list_owned_book()
~def create_review()
~def update_review()
~def delete_review()
}
class user{
+id
+first name
+last name
+email
#password
+achat
+favoris
~def create_user()
~def update_user()
~def delete_user()
~def list_author()
~def list_book()
~def list_owned_book()
~def create_review()
~def update_review()
~def delete_review()
}
class stat{
+id
+trafic
+book_bought
+incomes
~def get_incomes()
~def get_trafic()
~def get_book_bought()
}
class book{
+id
+title
#authorid
+isbn
+price
+description
+review
+rating
+file_url
~def create_book()
~def update_book()
~def delete_book()
}
class event{
+id
#authorid
+title
+description
+date_event
~def create_event()
~def update_event()
~def delete_event()
}
class review{
+id
#userid
#authorid
#bookid
+comment
+rating
~def create_review()
~def update_review()
~def delete_review()
~def list_review_by_book()
}
```
