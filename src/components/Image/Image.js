import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import './Image.scss';

class Image extends React.Component {
    static propTypes = {
      dto: PropTypes.object,
      galleryWidth: PropTypes.number,
      index: PropTypes.number
    };

    constructor(props) {
      super(props);
      this.calcImageSize = this.calcImageSize.bind(this);
      this.rotate = this.rotate.bind(this);
      this.delete = this.delete.bind(this);
      this.expand = this.expand.bind(this);

      this.state = {
        size: 200,
        rotation: 0,//new state for rotating the image
        showImage: true,//new state for showing the image
        expandImage: false
      };
    }

    calcImageSize() {
      const {galleryWidth} = this.props;
      const targetSize = 200;
      const imagesPerRow = Math.round(galleryWidth / targetSize);
      const size = (galleryWidth / imagesPerRow);
      this.setState({
          size
      });
    }

    componentDidMount() {
      this.calcImageSize();
    }

    urlFromDto(dto) {
      return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
    }

    rotate(){
      let newRotation = this.state.rotation + 90;
      if(newRotation >= 360){
        newRotation =- 360;
      }
      this.setState({
        rotation: newRotation
      })
    }

    delete(){
      this.setState({
        showImage: false//changes the state of the componenat so it won't show the image
      });
    }

    expand(){
      this.props.getExpanded(true,this.props.index);
    }

  render() {
      const { rotation } =  this.state;
      const { showImage } = this.state;
      var noButton = {//this style is in order to remove the button GUI component
           backgroundColor: 'Transparent',
           outline: 'none',
           border: 'none',
           overflow: 'hidden',
           padding:0
    }

    if(showImage){//Conditional Rendering, wether or not to show the image
        var showImageSt = {
            backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
            width: this.state.size + 'px',
            height: this.state.size + 'px',
            transform: `rotate(${rotation}deg)`
        }
    } 
    else showImageSt={
           backgroundImage: null,
           outline: 'none',
           border: 'none',
           overflow: 'hidden',
           padding:0
    };
    return (
              <div className="image-root" style={showImageSt}>
              <div style={{transform: `rotate(${-rotation}deg)`}}>
                      <button style={noButton} onClick={this.rotate}>
                          <FontAwesome className="image-icon" name="sync-alt" title="Rotate"/>
                      </button>
                      <button style={noButton} onClick={this.delete}>
                          <FontAwesome className="image-icon" name="trash-alt" title="Delete"/>
                      </button>
                      <button style={noButton} onClick={this.expand}>
                          <FontAwesome className="image-icon" name="expand" title="Expand"/>
                      </button>
                  </div>
              </div>
    );
  }
}

export default Image;