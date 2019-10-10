const _infbg_ = {

  //used to prevent user fast mouse movements
  MAX_SPEED : 0.3,
  //background movement delay in milliseconds
  DELAY : 250,
  SCALE : 0.05,

  apply : props => {

    //overriding default properties
    _infbg_.MAX_SPEED = props.maxSpeed || _infbg_.MAX_SPEED;
    _infbg_.DELAY = props.delay || _infbg_.DELAY;

    const contentHtml = props.target.html();

    //copying content to a new container
    props.target.html(
      $('<div></div>')
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
      _infbg_.body = $('<div></div>').css({
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

    _infbg_._x = 0;
    _infbg_._l = 0;
    _infbg_._t = 0;
    _infbg_._dl = 0;
    _infbg_._dt = 0;
    props.target
      .on('mousemove', e => (setTimeout(_infbg_.mouseMove.bind(this, e), _infbg_.DELAY)))
      .on('mouseover', _infbg_.mouseOver);
  },

  updatePositions : e => {
    _infbg_._x = e.originalEvent.clientX;
    _infbg_._y = e.originalEvent.clientY;
  },

  getPiexelsToMove : (event, position, add) => {

    const mapper = new Map([
      ['left', {b:'_dl', c:'_l', d:'_x', e:'clientX'}],
      ['top', {b:'_dt', c:'_t', d:'_y', e:'clientY'}]
    ]).get(position);

    let piexelsToMove
    _infbg_[mapper.b] = _infbg_[mapper.c] - _infbg_.body.offset()[position] + (add || 0);
    
    return piexelsToMove = Math.min(
      Math.abs((piexelsToMove = ((event.originalEvent[mapper.e] - _infbg_[mapper.d])*_infbg_.SCALE))),
      _infbg_.MAX_SPEED
    ) * ((piexelsToMove > 0) ? 1 : -1)
  },

  mouseMove : e => {

    _infbg_.body.css('left', _infbg_.body.offset().left - _infbg_.getPiexelsToMove(e, 'left'));
    _infbg_.body.css('top', _infbg_.body.offset().top - _infbg_.getPiexelsToMove(e, 'top', document.body.scrollTop));

    _infbg_.updatePositions(e);
  },

  mouseOver : e => {

    _infbg_._l = _infbg_.body.offset().left;
    _infbg_._t = _infbg_.body.offset().top;
    _infbg_.updatePositions(e);
  }
};

$(document).ready(() => {

  $('[infinity-background]').each((i, obj) => (_infbg_.apply({target : $(obj)})))
});
