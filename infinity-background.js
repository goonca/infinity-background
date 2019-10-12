/*
* Infinity Background
* by @goonca (https://github.com/goonca)
*/

window.$goonca = (window.$goonca || {});

$goonca.infinityBackground = function(props) {

  const SCALE = 0.05; //coeficient to move the background (could be passed as a param)
  let MAX_SPEED = 0.3; //used to prevent user fast mouse movements
  let DELAY = 250; //background movement delay in milliseconds
  let body; //floating background

  //variables to store background measure
  const measure = { _x : 0, _l : 0, _t : 0, _dl : 0, _dt : 0};

  /**
  * _updatePositions()
  * Assign mouse x and y positions to the measure variable. 
  * @param  e: mouse event
  * @return undefined
  */
  const _updatePositions = e => {
    measure._x = e.originalEvent.clientX;
    measure._y = e.originalEvent.clientY;
  }

  /**
  * _getPiexelsToMove()
  * Calculate the number of piexels to move based on scale and speed
  * @param  e: mouse event
  * @param  position: string indicating the movement direction 
  * @return number of piexels
  */
  const _getPiexelsToMove = (e, position) => {

    const mapper = new Map([
      ['left', {b:'_dl', c:'_l', d:'_x', e:'clientX'}],
      ['top', {b:'_dt', c:'_t', d:'_y', e:'clientY'}]
    ]).get(position);

    let piexelsToMove;
    measure[mapper.b] = measure[mapper.c] - body.offset()[position];
    
    return piexelsToMove = Math.min(
      Math.abs((piexelsToMove = ((e.originalEvent[mapper.e] - measure[mapper.d]) * SCALE))),
      MAX_SPEED
    ) * ((piexelsToMove > 0) ? 1 : -1)
  }

  /**
  * _mouseMove()
  * mouse event to update left and top of the floating background
  * see _getPiexelsToMove()
  * @param  e: mouse event
  * @return undefined
  */
  const _mouseMove = e => {

    body.css(
      'left',
      body.offset().left - _getPiexelsToMove(e, 'left')
    );

    //top position needs to considerate body scroll top position
    body.css(
      'top',
      body.offset().top - _getPiexelsToMove(e, 'top') - document.body.scrollTop
    );

    _updatePositions(e);
  }

  /**
  * _mouseOver()
  * store the floating background left and top position
  * to be used to calculate its movement on _mouseMove
  * see _getPiexelsToMove()
  * @param  e: mouse event
  * @return undefined
  */
  const _mouseOver = e => {

    measure._l = body.offset().left;
    measure._t = body.offset().top;
    _updatePositions(e);
  }

  /**
  * _apply()
  * apply the infinity background into the target defined in the properties
  * @return undefined
  */
  const _apply = () => {

    //overriding default properties
    MAX_SPEED = props.maxSpeed || MAX_SPEED;
    DELAY = props.delay || DELAY;

    //store the target html content to be wrapped
    const contentHtml = props.target.html();

    //copying content to a new container
    props.target.html(
      $('<div/>')
        .html(contentHtml)
        .css({
          'position' : 'absolute',
          'top' : '0',
          'bottom' : '0',
          'left' : '0',
          'right' : '0'
        })
    ).prepend(
      //creating floating background
      body = $('<div/>').css({
        'background-image' : props.target.css('background-image'),
        'background-repeat': 'no-repeat',
        'background-position': 'center',
        'background-size': 'cover',
        'position': 'absolute',
        'top': '-20%',
        'left': '-20%',
        'height': '140%',
        'width': '140%',
        'z-index' : '0'
      })
    ).css({
      'overflow' : 'hidden',
      'position' : 'relative'
    });

    props.target
      .on('mousemove', e => (setTimeout(_mouseMove.bind(this, e), DELAY)))
      .on('mouseover', _mouseOver);
  }  

  //public methods
  return {apply : _apply}
}

$(document).ready(() => {

  $('.goonca-infinity-background')
    .each((i, obj) => (new $goonca.infinityBackground({target : $(obj)}).apply()));
});
