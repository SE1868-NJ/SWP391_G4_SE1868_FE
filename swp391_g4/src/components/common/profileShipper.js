import Rating from '@mui/material/Rating';
const ProfileShipper = ( props) => {
    const shipper = props.props;
    console.log(shipper);
    return (
        <div className="row d-flex">
          {/* <div className="col-12 col-md-9 col-lg-7 col-xl-6"> */}
          <div className="">
            <div className="card p-0" style={{ borderRadius: '15px' }}>
              <div className="card-body p-4">
                <div className="d-flex">
                  
                  <div className="flex-grow-1 ms-3">
                    <div className="d-flex justify-content-between mb-3 ">
                      <div className="flex-shrink-0 me-3  ">
                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp"
                          alt="Danny McLoan" className="img-fluid rounded-3" style={{ width: '90px' }}/>
                      </div>
                      <div className="align-content-center">
                        <h6 className="mb-1">{shipper.FullName}</h6>
                        <span >{shipper.PhoneNumber}</span>
                        <p className="mb-2 pb-1">{shipper.Email}</p>
                        <Rating name="half-rating-read" value={Number( shipper.AverageRating)} precision={0.1} readOnly />
                      </div>
                    </div>
                    <div className="d-flex justify-content-start rounded-3 p-2 mb-2 bg-body-tertiary "style={{ width: 'fit-content' }} >
                      <div>
                        <p className="small text-muted mb-1">Code</p>
                        <p className="mb-0">#{shipper.ShipperID}</p>
                      </div>
                      <div className="px-3">
                        <p className="small text-muted mb-1">Bonus Amount</p>
                        <p className="mb-0">{shipper.BonusAmount} $</p>
                      </div>
                      <div className="px-3">
                        <p className="small text-muted mb-1">Total Rating</p>
                        <p className="mb-0">{shipper.TotalRatings}</p>
                      </div>
                    </div>

                    <p className="mb-2 pb-1">Vehicle : {shipper.VehicleDetails}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

    )};

export default ProfileShipper