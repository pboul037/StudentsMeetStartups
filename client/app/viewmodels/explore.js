define(function (require) {
    var app = require('durandal/app'),
        ko = require('knockout'),
        http = require('plugins/http'),
        session = require('session');

    return {
        exploreItems: ko.observableArray([]),
        logout : function () {
            session.logout();
        },
        
        activate: function () {
            
            var imgPlaceholder = 'http://placehold.it/200';
            
            function ExploreItem(userId, userType, name, img){
                return {
                    userId: ko.observable(userId),
                    userType: ko.observable(userType),
                    name: ko.observable(name),
                    img: ko.observable(img)
                };
            };
			
            var dummyExploreItems = [
				new ExploreItem(1, 'Student', 'John Doe', imgPlaceholder),
                new ExploreItem(2, 'Student', 'Jerry Springer', imgPlaceholder),
                new ExploreItem(3, 'Student', 'Edward Abbey', imgPlaceholder),
                new ExploreItem(4, 'Student', 'Jane Ace', imgPlaceholder),
                new ExploreItem(5, 'Student', 'Scott Adams', imgPlaceholder),
                new ExploreItem(6, 'Student', 'Robert Blair', imgPlaceholder),
                new ExploreItem(7, 'Student', 'Jimmy Carter', imgPlaceholder),
                new ExploreItem(8, 'Student', 'Pablo Casal', imgPlaceholder),
                new ExploreItem(9, 'Student', 'Dick Cavet', imgPlaceholder),
                new ExploreItem(10, 'Student', 'Leonardo Chiariglione', imgPlaceholder),
                new ExploreItem(11, 'Student', 'Margot Fonteyn', imgPlaceholder),
                new ExploreItem(12, 'Student', 'Owen Hart', imgPlaceholder),
                new ExploreItem(13, 'Student', 'Paul Keating', imgPlaceholder),
                new ExploreItem(14, 'Student', 'Thomas Mann', imgPlaceholder),
                new ExploreItem(15, 'Student', 'Bob Marley', imgPlaceholder),
                new ExploreItem(16, 'Student', 'Alice Munro', imgPlaceholder),
                new ExploreItem(17, 'Student', 'Conan OBrian', imgPlaceholder),
                new ExploreItem(18, 'Student', 'Rita Rudner', imgPlaceholder),
                new ExploreItem(19, 'Student', 'Jesssica Simpson', imgPlaceholder),
                new ExploreItem(20, 'Student', 'Elliot Smith', imgPlaceholder),
                new ExploreItem(21, 'Student', 'Nikola Tesla', imgPlaceholder),
                new ExploreItem(22, 'Student', 'Simon Travaglia', imgPlaceholder),
                new ExploreItem(23, 'Student', 'Donald Trump', imgPlaceholder),
                new ExploreItem(24, 'Student', 'Jane Wagner', imgPlaceholder),
                new ExploreItem(25, 'Student', 'April Winchell', imgPlaceholder),
                new ExploreItem(26, 'Student', 'Philip Wylie', imgPlaceholder),
                new ExploreItem(27, 'Student', 'Emilie Zola', imgPlaceholder),
                new ExploreItem(28, 'Student', 'John Mortimer', imgPlaceholder),
                new ExploreItem(29, 'Student', 'Jim Morrison', imgPlaceholder),
                new ExploreItem(30, 'Student', 'Tommy Franks', imgPlaceholder),
			];
            
            return this.exploreItems(dummyExploreItems);
        }
    };
});