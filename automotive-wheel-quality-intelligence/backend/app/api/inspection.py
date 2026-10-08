from fastapi import APIRouter, status

from app.schemas.quality import (
    WheelAIOutputContract,
    WheelInspectionRequest,
)

router = APIRouter()


@router.post(
    "/inspect",
    response_model=WheelAIOutputContract,
    status_code=status.HTTP_200_OK,
    summary="Inspect an aluminium alloy wheel",
)
def inspect_wheel(request: WheelInspectionRequest):
    """
    Submit an aluminium alloy wheel image for inspection.

    AI model integration will be connected after the dataset
    and inference pipeline are finalized.
    """

    return WheelAIOutputContract(
        wheel_id=request.wheel_id,
        batch_id=request.batch_id,
        machine_id=request.machine_id,
        defect_type=None,
        location=None,
        severity=None,
        defect_confidence=None,
        root_cause=None,
        root_cause_confidence=None,
        future_risk=None,
        recommended_action=None,
        affected_batches=[],
    )


@router.get(
    "/{wheel_id}",
    response_model=WheelAIOutputContract,
    summary="Get inspection result for a wheel",
)
def get_inspection(wheel_id: str):
    """
    Retrieve the inspection result for a specific wheel.

    Database integration will be added after the inspection
    persistence layer is finalized.
    """

    return WheelAIOutputContract(
        wheel_id=wheel_id,
        defect_type=None,
        location=None,
        severity=None,
        defect_confidence=None,
        root_cause=None,
        root_cause_confidence=None,
        future_risk=None,
        recommended_action=None,
        affected_batches=[],
    )