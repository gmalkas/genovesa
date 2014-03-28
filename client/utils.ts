/// <reference path="definitions/references.d.ts"/>
/// <reference path="./session.ts"/>

interface JQueryStatic {
    easing: any;
}

/*
 * Replaces the standard, linear interpolation of jQuery
 * with a quadratic transition.
 */
jQuery.easing.swing = function (x, t, b, c, d) {
  return -c * (t /= d) * (t - 2) + b;
};

interface Function {
    animationBound: any;
}

/**
 * Restricts a function to be called only when there are no ongoing animations.
 */
Function.prototype.animationBound = function () {
  return (function () {
    if ($(':animated').length) {
      return false;
    }
    
    this.apply(this, arguments);
  }).bind(this);
};

Handlebars.registerHelper('eq', function (arg0, arg1, options) {
    if (arg0 === arg1) {
        return options.fn(this);
    }

    return options.inverse(this);
});

Handlebars.registerHelper('lte', function (arg0, arg1, options) {
    if (arg0 <= arg1) {
        return options.fn(this);
    }

    return options.inverse(this);
});

Handlebars.registerHelper('ifLogged', function (options) {
    if (Genovesa.Session.currentUser && Genovesa.Session.isLogged()) {
            return options.fn(this);
    }

    return options.inverse(this);
});

Handlebars.registerHelper('ifFavorite', function (arg0, options) {
    if (Genovesa.Session.currentUser && Genovesa.Session.isLogged()) {
        if (Genovesa.Session.currentUser.hasBookmark(arg0)) {
            return options.fn(this);
        }
    }

    return options.inverse(this);
});

Handlebars.registerHelper('canChange', function (arg0, options) {
    if (Genovesa.Session.currentUser && Genovesa.Session.isLogged() && Genovesa.Session.currentUser.id == arg0.annotationGroup.owner.id) {
        return options.fn(this);
    }

    return options.inverse(this);
});

Handlebars.registerHelper('dateForEvent', function (event) {
    var date = event.annotationGroup.raw.tags.filter(t => { return t.key == 'Date'; });
    if (date.length > 0) {
        return date[0].value;
    }
});

Handlebars.registerHelper('placeForEvent', function (event) {
    var place = event.annotationGroup.raw.tags.filter(t => { return t.key == 'Lieu'; });
    if (place.length > 0) {
        return place[0].value;
    }
});

Handlebars.registerHelper('titleForEvent', function (event) {
    var type = event.annotationGroup.raw.tags.filter(t => { return t.key == 'Type'; });
    if (type.length > 0) {
        return type[0].value;
    }
});
